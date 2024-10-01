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
import { Person } from '../../models';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent {
  taskForm: FormGroup;

  minDate: string;

  constructor(private fb: FormBuilder, private taskService: TaskService) {
    this.minDate = new Date().toISOString().split('T')[0];

    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      deadline: ['', [Validators.required, this.dateValidator()]],
      people: this.fb.array(
        [],
        [Validators.required, this.uniqueNameValidator()]
      ),
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
      age: ['', [Validators.required, Validators.min(18), this.ageValidator()]],
      skills: this.fb.array([], [Validators.required, this.skillsValidator()]),
    });
    this.peopleFormArray.push(personForm);
    this.taskForm.updateValueAndValidity();
  }

  removePerson(index: number): void {
    this.peopleFormArray.removeAt(index);
    this.taskForm.updateValueAndValidity();
  }

  addSkill(personIndex: number): void {
    const skillsFormArray = this.getSkillsFormArray(personIndex);
    skillsFormArray.push(
      this.fb.control('', [Validators.required, this.stringValidator()])
    );
  }

  removeSkill(personIndex: number, skillIndex: number): void {
    const skillsFormArray = this.getSkillsFormArray(personIndex);
    skillsFormArray.removeAt(skillIndex);
  }

  hasDuplicateNames(): boolean {
    const people = this.peopleFormArray.value;
    const names = people.map((person: Person) => person.fullName.toLowerCase());
    const uniqueNames = new Set(names);
    return names.length !== uniqueNames.size;
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

  uniqueNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const people = control.value as Person[];
      const names = people.map((person) => person.fullName.toLowerCase());
      const uniqueNames = new Set(names);
      if (names.length !== uniqueNames.size) {
        return { duplicateName: true };
      }
      return null;
    };
  }

  dateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        return { pastDate: true };
      }
      return null;
    };
  }

  ageValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === '') return null;
      if (!Number.isInteger(Number(value))) {
        return { notInteger: true };
      }
      return null;
    };
  }

  stringValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === '') return null;
      if (/^\d+$/.test(value)) {
        return { notString: true };
      }
      return null;
    };
  }

  skillsValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const skills = control.value as string[];
      if (skills.some((skill) => /^\d+$/.test(skill))) {
        return { invalidSkills: true };
      }
      return null;
    };
  }
}
