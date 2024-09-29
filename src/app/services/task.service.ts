import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Person, Skill, Task } from '../models';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks: Task[] = [];
  private tasksSubject: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>(
    []
  );

  constructor() {}

  public getTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  public addTask(task: Task): void {
    this.tasks.push(task);
    this.tasksSubject.next(this.tasks);
  }

  public updateTask(task: Task): void {
    const index = this.tasks.findIndex((t) => t.id === task.id);
    if (index !== -1) {
      this.tasks[index] = task;
      this.tasksSubject.next(this.tasks);
    }
  }

  public toggleTaskCompletion(taskId: number): void {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      this.tasksSubject.next(this.tasks);
    }
  }

  public addPersonToTask(taskId: number, person: Person): void {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      task.people.push(person);
      this.tasksSubject.next(this.tasks);
    }
  }

  public removePersonFromTask(taskId: number, personName: string): void {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      task.people = task.people.filter((p) => p.fullName !== personName);
      this.tasksSubject.next(this.tasks);
    }
  }

  public addSkillToPerson(
    taskId: number,
    personName: string,
    skill: Skill
  ): void {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      const person = task.people.find((p) => p.fullName === personName);
      if (person) {
        person.skills.push(skill);
        this.tasksSubject.next(this.tasks);
      }
    }
  }

  public removeSkillFromPerson(
    taskId: number,
    personName: string,
    skillName: string
  ): void {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      const person = task.people.find((p) => p.fullName === personName);
      if (person) {
        person.skills = person.skills.filter((s) => s.name !== skillName);
        this.tasksSubject.next(this.tasks);
      }
    }
  }
}
