# **📌Task Management System - Frontend**

![Angular](https://img.shields.io/badge/Angular-19.1.8-red)
![Node](https://img.shields.io/badge/Node-20.14.0-brown)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.0-purple)
![Chart.js](https://img.shields.io/badge/Chart.js-4.0.0-yellow)

The **Task Management System Frontend** is a modern and responsive Angular application designed to interact with the backend APIs. It provides a user-friendly interface for managing tasks, users, comments, and notifications.
 

## 💻Live experience: https://taskmaster128.netlify.app
## 🛫Consume Restful web-services: https://taskmaster-v1.onrender.com/api
 
 <video width="100%" controls>
  <source src="Media/auth.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

<video width="100%" controls>
  <source src="Media/task.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

## **📌Table of Contents**

- [Features](#features)
- [Technologies Used](#-tech-stack)
- [Setup Instructions](#-setup-instructions)
- [Project Structure](#project-structure)
- [Running the Application](#-deploy-to-server)
- [UI screenshots](#ui-screenshots)
- [License](#license)


## **📌 Features**
- ✅ **User Authentication (JWT-based)**
- ✅ **Dashboard with Task Statistics (Pie Charts & Graphs)**
- ✅ **Task Creation, Editing, & Status Updates**
- ✅ **Real-time Notifications & Comments**
- ✅ **File Attachments (Upload & Download)**
- ✅ **Role-Based Access (`Admin`, `User`)**
- ✅ **Pagination & Sorting**
- ✅ **Bootstrap-based UI with CSS Animations**


## **📌 Tech Stack**
- **Angular 19**
- **TypeScript**
- **Bootstrap 5**
- **Chart.js (Pie Charts & Graphs)**
- **RxJS for Observables**
- **Angular Material (Optional)**
- **SCSS / CSS for Styling**

##  **📌 Setup Instructions**

### Prerequisites

- Node.js 20+
- Angular CLI 19+

### Steps:

### **1️⃣ Clone the Repository**
```bash
https://github.com/Pranav128/Task-management-system-frontend.git
cd task-management-frontend
```
### **2️⃣ Install Dependencies**
```bash
npm install
```
### **3️⃣ Configure Environment Variables**:
- Update the environment.ts file with your backend API URL:
```typescript
export const environment = {
    production: false,
    apiUrl: 'http://localhost:8080/api'
};
```
### **4️⃣ Run the Angular App**

```bash
ng serve
```
### **5️⃣ Access the Application**
-  Open your browser and navigate to ```http://localhost:4200```

## **📌Project Structure**
```bash
src/
├── app/                     # Application components and services
│   ├── auth/                # Authentication module
│   ├── components/          # All important components
│   ├── interceptor/         # Interceptor for handling requests
│   ├── models/              # All model classes and interfaces
│   ├── service/             # All business logic 
│   ├── tasks/               # Task management module
│   └── app.component.ts     # Root component
├── assets/                  # Static assets (images, styles)
├── environments/            # Environment configurations
└── styles.css               # Global styles
```

## **📌 Deployment**
### **🛠 Build for Production**
```bash
ng build --configuration=production
```
This will generate files inside the /dist/ folder.

## **🚀 Deploy to Server**
Copy the contents of /dist/task-management-frontend/ to a web server (Apache, Nginx, Firebase, Netlify, Vercel).


## **📌UI Screenshots**
1. **Home Page**
    ![Home](Media/screenshots/home1.png "Home")
2. **Signup Page**
    ![Signup](Media/screenshots/signup.png "Signup")
3. **Login Page**
    ![Login](Media/screenshots/login.png "Login")
4. **Dashboard Page**
    ![Dashboard](Media/screenshots/dashboard.png "Dashboard")
5. **Task List Page**
    ![TaskList](Media/screenshots/taks-list.png "TaskList")
6. **Task Details Page**
    ![Task Details](Media/screenshots/taskDetails1.png "Task Details")
    ![Task Details](Media/screenshots/taskDetails2.png "Task Details")
7. **New Task Page**
    ![Home](Media/screenshots/createTask1.png "New Task")
    ![Home](Media/screenshots/createTask2.png "New Task")
    ![Home](Media/screenshots/createTask3.png "New Task")
8. **Profile Page**
    ![Profile](Media/screenshots/profile1.png "Profile")
    ![Profile](Media/screenshots/profile2.png "Profile")
9. **Forgot-Password Page**
    ![Forgot-Password](Media/screenshots/forgotPass.png "Forgot-Password")
10. **Reset-Password Page**
    ![Reset-Password](Media/screenshots/resetPass.png "Reset-Password")
11. **Access-denied Page**
    ![Access-denied](Media/screenshots/access-denied.png "Access-denied")
    
## **📌License**
This project is licensed under the MIT License. See the [LICENSE](/LICENSE) file for details.


