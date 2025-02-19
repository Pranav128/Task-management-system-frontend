import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from "@angular/material/card";
import { CreateTaskRequest } from '../../models/CreateTaskRequest';
import { UserServiceService } from '../../services/user-service.service';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,MatCardModule,MatCardModule,FormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css' 
})
export class TaskFormComponent implements OnInit {

  step = 1; 
  taskForm!: FormGroup;
  users: any[] = [];
  createdById!:number;
  createTaskRequest!:CreateTaskRequest;
  selectedAssignees: number[] = [];
  attachments: File[] = [];
  comments: string = '';
  notificationsEnabled: boolean = false;


 constructor(private fb: FormBuilder, private taskService: TaskService,private userService: UserServiceService) {
  this.taskForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    priority: ['', Validators.required],
    status: ['', Validators.required],
    dueDate: ['', Validators.required]
  });
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => this.users = users);
  }

  nextStep(): void {
    this.step++;
  }

  prevStep(): void {
    this.step--;
  }

  onFileSelected(event: any): void {
    this.attachments = event.target.files;
  }
/*
  submitTask(): void {
    const formData = this.taskForm.value;
    // Convert 'YYYY-MM-DDTHH:MM' to 'YYYY-MM-DDTHH:MM:SS'
    formData.dueDate = formData.dueDate ? `${formData.dueDate}:00` : null;

    console.log(this.taskForm.value);
    const taskData:TaskRequest = {
      createTaskRequest: this.taskForm.value,
      createdById: this.createdById = 1, // Replace with the actual logged-in user ID
      assigneeIds: this.selectedAssignees,
      comments: this.comments,
      attachments:this.attachments
      // notificationsEnabled: this.notificationsEnabled
    };
    this.taskService.createTask(taskData).subscribe(response => {
      console.log('Task created:', response);
      alert('Task created successfully!');
    });
  }
*/

/*
submitTask(): void {
  const formDataSubmit = new FormData();
    const formData = this.taskForm.value;
    // Convert 'YYYY-MM-DDTHH:MM' to 'YYYY-MM-DDTHH:MM:SS'
    formData.dueDate = formData.dueDate ? `${formData.dueDate}:00` : null;

  // Convert JSON taskRequest to Blob and append to FormData
  // formDataSubmit.append('createTaskRequest', new Blob([JSON.stringify(this.taskForm.value)], { type: 'application/json' }));
  formDataSubmit.append('createTaskRequest', JSON.stringify(this.taskForm.value)); // Correct way

  formDataSubmit.append('createdById', String(this.createdById));

  this.selectedAssignees.forEach((id, index) => {
    formDataSubmit.append(`assigneeIds[${index}]`, id.toString());
  });

  if (this.comments) {
    formDataSubmit.append('comments', String(this.comments));
  }

  // Attach files
  for (let i = 0; i < this.attachments.length; i++) {
    formDataSubmit.append('attachments', this.attachments[i]);
  }

  // Send the form data
  this.taskService.createTask(formData).subscribe(response => {
    console.log('Task created:', response);
    alert('Task created successfully!');
  },
  error => {
    console.error("Error creating task:", error); // Log the full error for debugging
    if (error.error && error.error.message) {
      alert("Error creating task: " + error.error.message); // Display a user-friendly message
    } else {
      alert("An error occurred while creating the task."); // Generic error message
    }
  });
}
*/

// submitTask(): void {
//   const formData = new FormData();

//   console.log(this.taskForm.value.dueDate);
  
//   this.taskForm.value.dueDate = this.taskForm.value.dueDate
//   ? this.taskForm.value.dueDate: null;
  
//   console.log(this.taskForm.value.dueDate);

//   // Append task data as JSON
//   const taskData: TaskRequest = {
//     createTaskRequest: this.taskForm.value,
//     createdById: 1, // Replace with the actual logged-in user ID
//     assigneeIds: this.selectedAssignees,
//     comments: this.comments,
//     attachments: [] // Attachments will be sent separately
//   };


//   formData.append('task', new Blob([JSON.stringify(taskData)], { type: 'application/json' }));

//    // Attach files (ensure they are being selected properly)
//    if (this.attachments.length > 0) {
//     for (let i = 0; i < this.attachments.length; i++) {
//       formData.append('attachments', this.attachments[i]); // File input
//     }
//   }

//   // Send the form data
//   this.taskService.createTask(formData).subscribe(response => {
//     console.log('Task created:', response);
//     alert('Task created successfully!');
//   },
//   error => {
//     console.error("Error creating task:", error); // Log the full error for debugging
//     if (error.error && error.error.message) {
//       alert("Error creating task: " + error.error.message); // Display a user-friendly message
//     } else {
//       alert("An error occurred while creating the task."); // Generic error message
//     }
//   });
// }


submitTask(): void {
  const formData = new FormData();

  // Append task data as key-value pairs
  formData.append('createTaskRequest.title', this.taskForm.value.title);
  formData.append('createTaskRequest.description', this.taskForm.value.description);
  formData.append('createTaskRequest.priority', this.taskForm.value.priority);
  formData.append('createTaskRequest.status', this.taskForm.value.status);
  formData.append('createTaskRequest.dueDate', this.taskForm.value.dueDate ? `${this.taskForm.value.dueDate}:00` : '');
  formData.append('createdById', String(this.createdById));
  
  if (this.comments) {
    formData.append('comments', this.comments);
  }

  // Append assignee IDs
  this.selectedAssignees.forEach((assigneeId, index) => {
    formData.append(`assigneeIds[${index}]`, assigneeId.toString());
  });

  // Append attachments
  if (this.attachments.length > 0) {
    for (let i = 0; i < this.attachments.length; i++) {
      formData.append('attachments', this.attachments[i]);
    }
  }

  // Send the request
  this.taskService.createTask(formData).subscribe(response => {
    console.log('Task created:', response);
    alert('Task created successfully!');
  },
  error => {
        console.error("Error creating task:", error); // Log the full error for debugging
        if (error.error && error.error.message) {
          alert("Error creating task: " + error.error.message); // Display a user-friendly message
        } else {
          alert("An error occurred while creating the task."); // Generic error message
        }
    });
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
