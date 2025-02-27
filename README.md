# **📌Task Management System - Frontend**

![Angular](https://img.shields.io/badge/Angular-19.1.8-red)
![Node](https://img.shields.io/badge/Node-20.14.0-brown)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.0-purple)
![Chart.js](https://img.shields.io/badge/Chart.js-4.0.0-yellow)

The **Task Management System Frontend** is a modern and responsive Angular application designed to interact with the backend APIs. It provides a user-friendly interface for managing tasks, users, comments, and notifications.


## **📌Table of Contents**

- [Features](#features)
- [UI screenshots](#ui-screenshots)
- [Technologies Used](#-tech-stack)
- [Setup Instructions](#-setup-instructions)
- [Project Structure](#project-structure)
- [Running the Application](#-deploy-to-server)
- [Contributing](#contributing)
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


## **📌UI Screenshots**


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
git clone https://github.com/your-repo/task-management-frontend.git
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

## **📌License**
This project is licensed under the MIT License. See the LICENSE file for details.

