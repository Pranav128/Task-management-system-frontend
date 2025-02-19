import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ErrorComponent } from './components/error/error.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SessionComponent } from './components/session/session.component';
import { TaskFormComponent } from './tasks/task-form/task-form.component';
import { TaskListComponent } from './tasks/task-list/task-list.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'signup', component: RegisterComponent},
    {path: 'newtask', component: TaskFormComponent, canActivate:[authGuard]},
    {path: 'home', component:HomeComponent},
    { path: 'error', component: ErrorComponent },
    { path: 'access-denied', component: ErrorComponent },
    {path: 'profile', component:ProfileComponent,canActivate:[authGuard]},
    {path: 'session', component: SessionComponent},
    {path: 'tasks', component: TaskListComponent, canActivate: [authGuard]},
    { path: '**', redirectTo: '/home', pathMatch: 'full' },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
];
