import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { environment } from '../../../env/environment';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../models/user';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgFor,NgIf,DatePipe,NgClass],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  notifications: any[] = [];
  upcomingTasks: any[] = [];
  recentActivity: any[] = [];
  taskStatusData: any = {};
  currentUser?:User;
  user$: Observable<User| null>;

  constructor(private http: HttpClient, private authService: AuthService) {
    Chart.register(...registerables);
    this.user$ = this.authService.getUser();
    this.loadMockData(); // Load mock data for the dashboard
    this.renderTaskStatusChart(); // Render the chart
  }

  ngOnInit() {
    this.user$.subscribe(user => {
      if (user) {
        this.currentUser=user;
        console.log(user);        
      } else {
        console.warn("User is null, cannot set CreatedById");
      }
    });
    // this.fetchDashboardData();    
  }

  loadMockData() {
    // Mock Notifications
    this.notifications = [
      { message: 'Task "Design Homepage" is due tomorrow.', timestamp: new Date() },
      { message: 'You have 3 new comments on "Fix Bugs".', timestamp: new Date() }
    ];

    // Mock Upcoming Tasks
    this.upcomingTasks = [
      { title: 'Design Homepage', dueDate: new Date(), status: 'IN_PROGRESS' },
      { title: 'Fix Bugs', dueDate: new Date(), status: 'TODO' },
      { title: 'Write Documentation', dueDate: new Date(), status: 'DONE' }
    ];

    // Mock Recent Activity
    this.recentActivity = [
      { user: 'John Doe', action: 'commented on', target: 'Design Homepage', timestamp: new Date() },
      { user: 'Jane Smith', action: 'updated', target: 'Fix Bugs', timestamp: new Date() }
    ];

    // Mock Task Status Data
    this.taskStatusData = {
      TODO: 5,
      IN_PROGRESS: 3,
      DONE: 2
    };
  }

  fetchDashboardData() {
    // Fetch notifications
    this.http.get<any[]>(`${environment.apiUrl}/notifications/user/${this.currentUser?.id}`).subscribe(notifications => {
      this.notifications = notifications;
    });

    // Fetch upcoming tasks
    this.http.get<any[]>(`${environment.apiUrl}/tasks`).subscribe(tasks => {
      this.upcomingTasks = tasks;
    });

    // Fetch recent activity
    // this.http.get<any[]>(`${environment.apiUrl}/activity`).subscribe(activity => {
    //   this.recentActivity = activity;
    // });

    // Fetch task status data for the chart
    this.http.get<any>(`${environment.apiUrl}/tasks/status`).subscribe(data => {
      this.taskStatusData = data;
      this.renderTaskStatusChart();
    });
  }

  renderTaskStatusChart() {
    const ctx = document.getElementById('taskStatusChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(this.taskStatusData),
        datasets: [{
          data: Object.values(this.taskStatusData),
          backgroundColor: ['#007bff', '#28a745', '#dc3545', '#ffc107'],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: { enabled: true }
        }
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'TODO': return 'status-todo';
      case 'IN_PROGRESS': return 'status-in-progress';
      case 'DONE': return 'status-done';
      default: return '';
    }
  }

  createNewTask() {
    // Navigate to task creation page
  }

  viewAllTasks() {
    // Navigate to tasks list page
  }
}