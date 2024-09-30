import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
  ValidationErrors,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent {
  taskForm: FormGroup;

  constructor(private fb: FormBuilder, private taskService: TaskService) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      deadline: ['', [Validators.required]],
      people: this.fb.array([], [this.uniqueNameValidator()]),
    });
  }

  get peopleFormArray(): FormArray {
    return this.taskForm.get('people') as FormArray;
  }

  getSkillsFormArray(personIndex: number): FormArray {
    return this.peopleFormArray.at(personIndex).get('skills') as FormArray;
  }

  addPerson(): void {
    const personForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(5)]],
      age: ['', [Validators.required, Validators.min(18)]],
      skills: this.fb.array([], Validators.required),
    });
    this.peopleFormArray.push(personForm);
  }

  removePerson(index: number): void {
    this.peopleFormArray.removeAt(index);
  }

  addSkill(personIndex: number): void {
    const skillsFormArray = this.getSkillsFormArray(personIndex);
    skillsFormArray.push(this.fb.control('', Validators.required));
  }

  removeSkill(personIndex: number, skillIndex: number): void {
    const skillsFormArray = this.getSkillsFormArray(personIndex);
    skillsFormArray.removeAt(skillIndex);
  }

  uniqueNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const people = control.value as any[];
      const names = people.map((p) => p.fullName.toLowerCase());
      const uniqueNames = new Set(names);
      if (names.length !== uniqueNames.size) {
        return { duplicateName: true };
      }
      return null;
    };
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const newTask = {
        id: Date.now(),
        title: this.taskForm.value.title,
        deadline: this.taskForm.value.deadline,
        completed: false,
        people: this.taskForm.value.people,
      };
      this.taskService.addTask(newTask);

      this.clearPeopleFormArray();

      this.taskForm.reset();
    }
  }

  clearPeopleFormArray(): void {
    while (this.peopleFormArray.length !== 0) {
      this.peopleFormArray.removeAt(0);
    }
  }
}
