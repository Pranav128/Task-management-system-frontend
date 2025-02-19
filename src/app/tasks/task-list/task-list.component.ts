import { DatePipe, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [DatePipe,NgFor],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  tasks: any[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.fetchTasks();
  }
  fetchTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (response) => {
        this.tasks = response.content; // `content` is where paginated data is stored
        console.log('Tasks:', this.tasks);
      },
      error: (error) => {
        console.error('Error fetching tasks:', error);
      }
    });
  }
}