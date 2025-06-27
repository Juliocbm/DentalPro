import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  loading = false;
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.invalid) return;
    this.loading = true;
    const { username, password } = this.loginForm.value;
    this.auth.login({
      username: username ?? '',
      password: password ?? ''
    }).subscribe({
      // En el futuro, 'user' incluirá el token proveniente del backend
      next: (user) => {
        if (user && user.token) {
          // El token ya se guarda en AuthService, aquí podrías hacer lógica adicional si lo necesitas
          this.toastr.success('¡Bienvenido!');
          this.router.navigate(['/dashboard']);
        } else {
          this.toastr.error('Credenciales incorrectas');
          this.loading = false;
        }
      },
      error: () => {
        this.toastr.error('Error en el login');
        this.loading = false;
      }
    });
  }
}
