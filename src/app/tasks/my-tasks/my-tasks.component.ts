import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { TaskResponse } from '../../models/task-response';
import { User } from '../../models/user';
import { UserServiceService } from '../../services/user-service.service';
import { TaskService } from '../task.service';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-my-tasks',
  standalone: true,
  imports: [NgIf, DatePipe, NgFor, NgClass, FormsModule],
  templateUrl: './my-tasks.component.html',
  styleUrl: './my-tasks.component.css',
})
export class MyTasksComponent implements OnInit {
  tasks: TaskResponse[] = [];
  searchQuery: string = '';
  page: number = 0;
  size: number = 12;
  totalTasks: number = 0;
  sortBy: string = 'dueDate,asc'; //Default sorting
  isSearching: boolean = false; // Track if the user is searching

  notifications: any[] = [];
  showNotifications: boolean = false;

  currentUser?: User;
  user$: Observable<User | null>;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private userService: UserServiceService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.user$ = this.authService.getUser();
  }

  ngOnInit(): void {
    this.user$.subscribe((user) => {
      if (user) {
        this.currentUser = user;
        console.log(user);
      } else {
        console.warn('User is null, cannot set CreatedById');
      }
    });
    this.fetchTasks();
    this.fetchNotifications();
  }

  //notifications

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  fetchNotifications() {
    this.notificationService
      .fetchNotificationsByUser(Number(this.currentUser?.id))
      .subscribe({
        next: (notifications) => {
          this.notifications = notifications;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  fetchTasks(): void {
    this.taskService
      .getTasksByUserId(
        this.page,
        this.size,
        this.sortBy,
        Number(this.currentUser?.id)
      )
      .subscribe({
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
}
