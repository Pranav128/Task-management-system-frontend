import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ErrorComponent } from './components/error/error.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SessionComponent } from './components/session/session.component';
import { MyTasksComponent } from './tasks/my-tasks/my-tasks.component';
import { TaskDetailComponent } from './tasks/task-detail/task-detail.component';
import { TaskFormComponent } from './tasks/task-form/task-form.component';
import { TaskListComponent } from './tasks/task-list/task-list.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'signup', component: RegisterComponent},
    {path: 'home', component:HomeComponent},
    {path: 'session', component: SessionComponent},
    { path: 'error', component: ErrorComponent },
    { path: 'access-denied', component: AccessDeniedComponent },
    {path: 'newtask', component: TaskFormComponent, canActivate:[authGuard]},
    { path: 'tasks/:id', component: TaskDetailComponent, canActivate:[authGuard] },
    {path: 'profile', component:ProfileComponent,canActivate:[authGuard]},
    {path: 'tasks', component: TaskListComponent, canActivate: [authGuard]},
    {path: 'mytasks', component: MyTasksComponent, canActivate: [authGuard]},
    {path: 'dashboard', component: DashboardComponent, canActivate: [authGuard]},
    {path: 'reset-password', component: ResetPasswordComponent },
    {path: 'forgot-password', component:ForgotPasswordComponent},
    { path: '**', redirectTo: '/home', pathMatch: 'full' },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
];
