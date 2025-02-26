import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskResponse } from '../../models/task-response';
import { TaskService } from '../task.service';

@Component({
    selector: 'app-task-list',
    imports: [NgIf, DatePipe, NgFor, NgClass, FormsModule],
    templateUrl: './task-list.component.html',
    styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  tasks: TaskResponse[] = [];
  searchQuery: string = '';
  page: number = 0;
  size: number = 12;
  totalTasks: number = 0;
  sortBy: string = 'dueDate,asc'; //Default sorting
  isSearching: boolean = false; // Track if the user is searching

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    this.fetchTasks();
  }

  fetchTasks(): void {
    this.taskService.getTasks(this.page, this.size, this.sortBy).subscribe({
      next: (response) => {
        this.tasks = response.content; // `content` is where paginated data is stored
        this.totalTasks = response.totalElements;
        console.log('totaltasks: ' + this.totalTasks);
        console.log('Tasks:', this.tasks);
      },
      error: (error) => {
        console.error('Error fetching tasks:', error);
      },
    });
  }

  // Handle search input
  onSearch(): void {
    if (this.searchQuery) {
      this.isSearching = true;
      this.taskService
        .searchTasks(this.searchQuery, '', '') // Search by title only (adjust as needed)
        .subscribe({
          next: (tasks: TaskResponse[]) => {
            this.tasks = tasks;
            console.log('Search results:', this.tasks);
          },
          error: (error) => {
            console.error('Error searching tasks:', error);
          },
        });
    } else {
      this.isSearching = false;
      this.fetchTasks(); // Revert to paginated view
    }
  }

  // Generate an array of page numbers for pagination
  getPaginationArray(): number[] {
    const totalPages = Math.ceil(this.totalTasks / this.size);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Handle page change
  onPageChange(page: number): void {
    this.page = page;
    this.fetchTasks();
  }

  // Handle sorting change
  onSortChange(sortBy: string): void {
    this.sortBy = sortBy;
    this.fetchTasks();
  }

  // Navigate to task details
  navigateToTaskDetails(taskId: number | undefined): void {
    this.router.navigate(['/tasks', taskId]);
  }

  new() {
    this.router.navigate(['/newtask']);
  }
}
