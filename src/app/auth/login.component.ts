import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  loading = false;
  loginForm: FormGroup;
  errorMessage = '';
  showEmailConfirmationError = false;
  
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    console.log('🚀 LoginComponent loaded!');
    this.loginForm = this.fb.group({
      username: ['juliocbm500@gmail.com', [Validators.required, Validators.email]],
      password: ['password123', Validators.required]
    });
  }

  async resendConfirmationEmail() {
    const email = this.loginForm.get('username')?.value;
    if (!email) {
      this.errorMessage = 'Por favor ingresa tu email';
      return;
    }

    try {
      console.log('📧 [LoginComponent] Reenviando email de confirmación...');
      await this.authService.resendConfirmationEmail(email);
      this.errorMessage = 'Email de confirmación enviado. Revisa tu bandeja de entrada';
      this.showEmailConfirmationError = false;
    } catch (error: any) {
      console.error('❌ [LoginComponent] Error reenviando email:', error);
      this.errorMessage = 'Error enviando email de confirmación. Intenta de nuevo';
    }
  }

  ngOnInit() {
    // Verificar si ya está autenticado y redirigir
    this.authService.user$.subscribe(user => {
      if (user) {
        console.log('🔍 LoginComponent - Usuario ya autenticado:', user);
        console.log('✅ Usuario ya autenticado, redirigiendo a dashboard...');
        this.router.navigate(['/dashboard']);
      }
    });
  }

  async login() {
    if (this.loginForm.invalid) {
      console.error('❌ Formulario inválido');
      return;
    }
    
    // Limpiar errores previos
    this.errorMessage = '';
    this.showEmailConfirmationError = false;
    
    console.log('🔐 [LoginComponent] Iniciando login...');
    this.loading = true;
    const { username, password } = this.loginForm.value;
    
    try {
      const result = await this.authService.login({
        username: username ?? '',
        password: password ?? ''
      });
      
      if (result && result.token) {
        console.log('✅ [LoginComponent] Login exitoso:', result);
        console.log('🚀 [LoginComponent] Redirigiendo a dashboard...');
        this.router.navigate(['/dashboard']);
      } else {
        console.log('❌ [LoginComponent] Login falló:', result);
        this.loading = false;
      }
    } catch (error: any) {
      console.error('❌ [LoginComponent] Error durante login:', error);
      this.loading = false;
      
      // Limpiar errores previos
      this.errorMessage = '';
      this.showEmailConfirmationError = false;
      
      if (error?.message) {
        if (error.message.includes('Invalid login credentials')) {
          this.errorMessage = 'Email o contraseña incorrectos';
        } else if (error.message.includes('Email not confirmed') || error.error_code === 'email_not_confirmed') {
          this.errorMessage = 'Tu email no ha sido confirmado';
          this.showEmailConfirmationError = true;
        } else if (error.message.includes('Too many requests')) {
          this.errorMessage = 'Demasiados intentos. Intenta de nuevo en unos minutos';
        } else {
          this.errorMessage = error.message;
        }
      } else if (error?.error_code === 'email_not_confirmed') {
        this.errorMessage = 'Tu email no ha sido confirmado';
        this.showEmailConfirmationError = true;
      } else {
        this.errorMessage = 'Error en el login. Intenta de nuevo';
      }
      
      console.error('📝 [LoginComponent] Mensaje de error:', this.errorMessage);
    }
  }
}
