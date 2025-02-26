import { DatePipe, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../models/user';
import { UserServiceService } from '../../services/user-service.service';
import { NotificationService } from '../notification.service';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, FormsModule, NgFor, DatePipe],
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css'],
})
export class TaskDetailComponent implements OnInit {
  taskId: string = '';
  task: any = {};
  comments: any[] = [];
  attachments: any[] = [];
  notifications: any[] = [];

  user$: Observable<User | null>;
  currentUser: User | null = null;
  users: User[] = [];

  statusOptions = ['TODO', 'IN_PROGRESS', 'DONE'];
  priorityOptions = ['LOW', 'MEDIUM', 'HIGH'];

  newComment: string = '';
  newAssignee: string = '';
  showNotifications: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private taskService: TaskService,
    private userService: UserServiceService,
    private notificationService: NotificationService
  ) {
    this.user$ = this.authService.getUser();
  }

  ngOnInit() {
    this.user$.subscribe((user) => {
      if (user) {
        this.currentUser = user;
      } else {
        console.warn('User is null, cannot set CreatedById');
      }
    });
    this.taskId = this.route.snapshot.paramMap.get('id')!;
    this.getTaskDetails();
    this.loadAttachments();
    this.fetchAllUsers();
    this.fetchNotifications();
  }

  //attachments

  loadAttachments() {
    this.taskService.getAttachments(Number(this.taskId)).subscribe({
      next: (response) => {
        this.attachments = response;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  downloadAttachment(attachmentId: string, fileName: string) {
    this.taskService
      .downloadAttachment(Number(this.taskId), fileName, attachmentId)
      .subscribe({
        next: (blob) => {
          const a = document.createElement('a');
          const objectUrl = URL.createObjectURL(blob);
          a.href = objectUrl;
          a.download = fileName;
          a.click();
          URL.revokeObjectURL(objectUrl);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  uploadAttachments() {
    const formData = new FormData();
    for (let file of this.attachments) {
      formData.append('file', file);
    }

    this.taskService
      .uploadAttachments(Number(this.taskId), formData)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.loadAttachments(); //reload attachments
          alert('📎 Attachments uploaded successfully!');
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  deleteAttachment(attachment: any) {
    if (confirm('Are you sure you want to delete this attachment?')) {
      this.taskService
        .deleteAttachment(Number(this.taskId), attachment.id)
        .subscribe({
          next: (response) => {
            console.log(response);
            alert('✅ Attachment deleted successfully!');
            this.loadAttachments(); // Refresh list
          },
          error: (error) => {
            console.log(error);
          },
        });
    }
  }

  onFileSelected(event: any) {
    this.attachments = Array.from(event.target.files);
  }

  //notifications

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  fetchNotifications() {
    this.notificationService.fetchNotifications(Number(this.taskId)).subscribe({
      next: (notifications) => {
        this.notifications = notifications;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  //user and assignee
  fetchAllUsers() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  //later
  addAssignee() {
    if (this.newAssignee.trim()) {
      this.task.assignees.push(this.newAssignee.replace('@', ''));
      this.newAssignee = '';
    }
  }

  deleteTask() {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(Number(this.taskId)).subscribe({
        next: (response) => {
          console.log(response);
          alert('Task deleted successfully!');
          this.router.navigate(['/tasks']); // Redirect to task list or another page
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }

  //task

  getTaskDetails() {
    this.taskService.getTaskById(Number(this.taskId)).subscribe({
      next: (task) => {
        console.log(task);
        this.task = task;
        this.comments = task.comments || [];
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  updateTask() {
    const updatedTask = {
      title: this.task.title,
      description: this.task.description,
      priority: this.task.priority,
      status: this.task.status,
      dueDate: this.task.dueDate,
      assignees: this.task.assignees,
    };
    console.log(updatedTask);
    this.taskService.updateTask(Number(this.taskId), updatedTask).subscribe({
      next: (task) => {
        console.log(task);
        this.getTaskDetails(); // Refresh task details
        alert('✅ Task updated successfully!');
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  editTitle() {
    const newTitle = prompt('Enter new title:', this.task.title);
    if (newTitle) {
      this.task.title = newTitle;
    }
  }

  //comment

  addComment() {
    if (this.newComment.trim()) {
      const comment = {
        userId: this.currentUser?.id,
        comment: this.newComment,
        timestamp: new Date(),
      };

      this.taskService.addComment(Number(this.taskId), comment).subscribe({
        next: (response) => {
          this.comments.push(comment.comment);
          this.newComment = '';
          console.log(response);
          this.getTaskDetails();
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }
}
