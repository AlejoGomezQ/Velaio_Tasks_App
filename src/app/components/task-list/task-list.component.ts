import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

//Models
import { Task } from '../../models';

//Services
import { TaskService } from '../../services/task.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit {
  tasks$: Observable<Task[]>;
  filteredTasks$: Observable<Task[]>;
  statusFilter: 'all' | 'completed' | 'pending' = 'all';

  constructor(private taskService: TaskService) {
    this.tasks$ = this.taskService.getTasks();
    this.filteredTasks$ = this.tasks$;
  }

  ngOnInit(): void {
    this.applyFilter();
  }

  toggleTaskCompletion(taskId: number): void {
    this.taskService.toggleTaskCompletion(taskId);
  }

  applyFilter(): void {
    this.filteredTasks$ = this.tasks$.pipe(
      map((tasks) => {
        switch (this.statusFilter) {
          case 'completed':
            return tasks.filter((task) => task.completed);
          case 'pending':
            return tasks.filter((task) => !task.completed);
          default:
            return tasks;
        }
      })
    );
  }
}
