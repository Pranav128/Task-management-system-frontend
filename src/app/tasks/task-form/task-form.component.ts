import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop'; // Import DragDropModule
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { CreateTaskRequest } from '../../models/CreateTaskRequest';
import { User } from '../../models/user';
import { UserServiceService } from '../../services/user-service.service';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    DragDropModule,
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatCardModule,
    FormsModule,
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent implements OnInit {
  step = 1;
  taskForm!: FormGroup;

  allUsers: any[] = [];
  selectedUsers: any[] = []; // Users selected for the task
  selectedAssignees: number[] = [];

  user$: Observable<User | null>;
  createdById!: any;
  createTaskRequest!: CreateTaskRequest;
  attachments: File[] = [];
  comments: string[] = []; // Store comments as an array
  newComment: string = ''; // Temporary variable for the new comment
  notificationsEnabled: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private taskService: TaskService,
    private userService: UserServiceService
  ) {
    this.user$ = this.authService.getUser();
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      priority: ['', Validators.required],
      status: ['', Validators.required],
      dueDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe((users) => (this.allUsers = users));
    this.user$.subscribe((user) => {
      if (user) {
        this.createdById = user.id; // Assign user ID
        console.log('CreatedById set to:', this.createdById);
      } else {
        console.warn('User is null, cannot set CreatedById');
      }
    });
    console.log(this.authService.getUsername());
    console.log(this.authService.getUserId());
  }

  nextStep(): void {
    this.step++;
  }

  prevStep(): void {
    this.step--;
  }

  addComment() {
    if (this.newComment.trim()) {
      this.comments.push(this.newComment.trim()); // Add the new comment to the array
      this.newComment = ''; // Clear the input field
    }
  }

  deleteComment(index: number) {
    this.comments.splice(index, 1); // Remove the comment at the specified index
  }

  onFileSelected(event: any): void {
    this.attachments = event.target.files;
  }

  submitTask(): void {
    const formData = new FormData();

    // Ensure createdById is a valid number before appending
    if (!this.createdById || isNaN(Number(this.createdById))) {
      console.error('Invalid createdById:', this.createdById);
      alert('Invalid user ID. Please log in again.');
      return;
    }

    // Append task data as key-value pairs
    formData.append('createTaskRequest.title', this.taskForm.value.title);
    formData.append(
      'createTaskRequest.description',
      this.taskForm.value.description
    );
    formData.append('createTaskRequest.priority', this.taskForm.value.priority);
    formData.append('createTaskRequest.status', this.taskForm.value.status);
    formData.append(
      'createTaskRequest.dueDate',
      this.taskForm.value.dueDate ? `${this.taskForm.value.dueDate}:00` : ''
    );
    formData.append('createdById', String(this.createdById)); // Convert to a valid string

    //append all comments
    if (this.comments.length > 0) {
      for (let i = 0; i < this.comments.length; i++) {
        formData.append('comments', this.comments[i]);
      }
    }

    // Append assignee IDs
    this.selectedUsers.forEach((assigneeId, index) => {
      formData.append(`assigneeIds[${index}]`, assigneeId.id);
    });

    // Append attachments
    if (this.attachments.length > 0) {
      for (let i = 0; i < this.attachments.length; i++) {
        formData.append('attachments', this.attachments[i]);
      }
    }

    // Send the request
    this.taskService.createTask(formData).subscribe(
      (response) => {
        console.log('Task created:', response);
        console.log('Task created:', response.title);

        alert('Task created successfully!');

        this.router.navigate(['/tasks']);
      },
      (error) => {
        console.error('Error creating task:', error); // Log the full error for debugging

        if (error.error && error.error.message) {
          alert('Error creating task: ' + error.error.message); // Display a user-friendly message
        } else {
          alert('An error occurred while creating the task.'); // Generic error message
        }
      }
    );
  }

  // Move user to selected list
  moveToSelected(user: any) {
    if (!this.isSelected(user)) {
      this.selectedUsers.push(user);
      this.allUsers = this.allUsers.filter((u) => u.id !== user.id);
    }
  }

  // Move user back to all users list
  moveToAll(user: any) {
    this.allUsers.push(user);
    this.selectedUsers = this.selectedUsers.filter((u) => u.id !== user.id);
  }

  // Check if a user is already selected
  isSelected(user: any): boolean {
    return this.selectedUsers.some((u) => u.id === user.id);
  }

  // Handle drag-and-drop events
  onDrop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      // Reorder within the same list
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // Move between lists
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  onAssigneeSelect(userId: number): void {
    const index = this.selectedAssignees.indexOf(userId);
    if (index === -1) {
      // Add user to selected assignees
      this.selectedAssignees.push(userId);
    } else {
      // Remove user from selected assignees
      this.selectedAssignees.splice(index, 1);
    }
  }
}
