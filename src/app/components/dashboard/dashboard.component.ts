import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { CommentResponse } from '../../models/comment';
import { User } from '../../models/user';
import { UserServiceService } from '../../services/user-service.service';
import { NotificationService } from '../../tasks/notification.service';
import { TaskService } from '../../tasks/task.service';

@Component({
  selector: 'app-dashboard',
  imports: [NgIf, NgFor, DatePipe, NgClass],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  tasks: any[] = []; // List of tasks fetched from the backend
  taskStatusData: any = {}; // Data for task status pie chart
  taskPriorityData: any = {}; // Data for task priority bar chart
  currentUser?: User; // Logged-in user
  isLoading: boolean = true; // Loading state
  errorMessage: string = ''; // Error message

  notifications: any[] = [];
  recentComments: CommentResponse[] = [];

  user$: Observable<User | null>;

  // Variables to store chart instances
  taskStatusChart: any;
  taskPriorityChart: any;

  constructor(
    private authService: AuthService,
    private dashboardService: TaskService,
    private notificationService: NotificationService,
    private userService: UserServiceService,
    private router: Router
  ) {
    this.user$ = this.authService.getUser();
    Chart.register(...registerables); // Register Chart.js components
  }

  ngAfterViewInit() {
    this.user$.subscribe((user) => {
      if (user) {
        this.currentUser = user || undefined;
        this.fetchDashboardData(); // Fetch data for the dashboard
      }
    });
  }

  ngOnInit() {
    // Fetch the current user
    this.user$.subscribe((user) => {
      if (user) {
        this.currentUser = user || undefined;
        this.fetchDashboardData(); // Fetch data for the dashboard
      }
    });
  }

  fetchDashboardData() {
    this.isLoading = true;
    this.errorMessage = '';

    // Fetch all tasks from the backend
    this.dashboardService
      .getTasksByUserId(0, 10, 'dueDate,asc', Number(this.currentUser?.id))
      .subscribe(
        (tasks) => {
          this.tasks = tasks.content;
          this.prepareChartData(); // Prepare data for charts
          this.isLoading = false;
        },
        (error) => {
          this.errorMessage =
            'Failed to load dashboard data. Please try again later.';
          this.isLoading = false;
          console.error(error);
        }
      );

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

    this.userService
      .getCommentsByUserId(Number(this.currentUser?.id))
      .subscribe({
        next: (resp) => {
          this.recentComments = resp;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  prepareChartData() {
    // Prepare data for task status pie chart
    this.taskStatusData = this.tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {});

    // Prepare data for task priority bar chart
    this.taskPriorityData = this.tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {});

    // Render charts
    this.renderTaskStatusChart();
    this.renderTaskPriorityChart();
  }

  renderTaskStatusChart() {
    const ctx = document.getElementById('taskStatusChart') as HTMLCanvasElement;

    // Destroy existing chart if it exists
    if (this.taskStatusChart) {
      this.taskStatusChart.destroy();
    }

    this.taskStatusChart=new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(this.taskStatusData),
        datasets: [
          {
            data: Object.values(this.taskStatusData),
            backgroundColor: ['#007bff', '#28a745', '#dc3545'], // Colors for TODO, IN_PROGRESS, DONE
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: { enabled: true },
        },
      },
    });
  }

  renderTaskPriorityChart() {
    const ctx = document.getElementById(
      'taskPriorityChart'
    ) as HTMLCanvasElement;

     // Destroy existing chart if it exists
     if (this.taskPriorityChart) {
      this.taskPriorityChart.destroy();
    }

    this.taskPriorityChart=new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(this.taskPriorityData),
        datasets: [
          {
            label: 'Task Priority',
            data: Object.values(this.taskPriorityData),
            backgroundColor: ['#dc3545', '#ffc107', '#28a745'], // Colors for HIGH, MEDIUM, LOW
            borderColor: ['#dc3545', '#ffc107', '#28a745'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true },
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true },
        },
      },
    });
  }

  getUpcomingTasks() {
    const today = new Date();
    return this.tasks.filter((task) => new Date(task.dueDate) > today);
  }

  // Method to get the CSS class for task status
  getStatusClass(status: string): string {
    switch (status) {
      case 'TODO':
        return 'status-todo';
      case 'IN_PROGRESS':
        return 'status-in-progress';
      case 'DONE':
        return 'status-done';
      default:
        return '';
    }
  }

  createNewTask() {
    this.router.navigate(['/newtask']);
  }

  viewAllTasks() {
    this.router.navigate(['/tasks']);
  }
}
