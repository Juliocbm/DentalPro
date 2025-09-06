import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { ForgotPasswordComponent } from './forgot-password.component';
import { ResetPasswordComponent } from './reset-password.component';
import { SimpleLoginComponent } from './simple-login.component';
import { MinimalLoginComponent } from './minimal-login.component';
import { SafeLoginComponent } from './safe-login.component';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'login-safe', component: SafeLoginComponent },
  { path: 'login-minimal', component: MinimalLoginComponent },
  { path: 'login-test', component: SimpleLoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
