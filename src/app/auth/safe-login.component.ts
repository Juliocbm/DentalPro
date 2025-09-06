import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-safe-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-800">🦷 DentalPro</h1>
          <p class="text-gray-600 mt-2">Iniciar Sesión (Supabase Seguro)</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <input 
              type="email" 
              formControlName="email"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="tu@email.com"
            >
            <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" 
                 class="text-red-500 text-sm mt-1">
              Email es requerido
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input 
              type="password" 
              formControlName="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            >
            <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" 
                 class="text-red-500 text-sm mt-1">
              Contraseña es requerida
            </div>
          </div>

          <button 
            type="submit" 
            [disabled]="loginForm.invalid || loading"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            ¿No tienes cuenta? 
            <a href="#" class="text-blue-600 hover:underline">Regístrate</a>
          </p>
        </div>

        <div *ngIf="message" class="mt-4 p-3 rounded-md" 
             [class]="messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
          {{ message }}
        </div>

        <div class="mt-4 text-xs text-gray-500">
          Estado Supabase: {{ supabaseStatus }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100vh;
    }
  `]
})
export class SafeLoginComponent {
  loginForm: FormGroup;
  loading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';
  supabaseStatus = 'Conectado';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    console.log('🚀 SafeLoginComponent loaded!');
    
    this.loginForm = this.fb.group({
      email: ['juliocbm500@gmail.com', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Verificar si ya está autenticado
    this.authService.getUser$().subscribe(user => {
      console.log('🔍 SafeLoginComponent - Usuario detectado:', user);
      if (user) {
        console.log('✅ Usuario ya autenticado, redirigiendo a dashboard...');
        this.router.navigate(['/dashboard']).then(
          (success) => {
            console.log('✅ Navegación exitosa:', success);
          },
          (error) => {
            console.error('❌ Error en navegación:', error);
            // Si falla, intentar con window.location
            console.log('🔄 Intentando con window.location...');
            window.location.href = '/dashboard';
          }
        );
      }
    });

  }

  async onLogin() {
    console.log('🔥 onLogin() ejecutado - INICIO');
    
    if (this.loginForm.invalid) {
      console.log('❌ Formulario inválido');
      this.markFormGroupTouched();
      return;
    }

    console.log('✅ Iniciando proceso de login con AuthService...');
    this.loading = true;
    this.message = '';

    try {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;
      console.log('📧 Email:', email);

      console.log('🔐 Llamando a AuthService.login...');
      const result = await this.authService.login({
        username: email,
        password: password
      });

      console.log('✅ AuthService.login exitoso:', result);
      this.messageType = 'success';
      this.message = '¡Login exitoso! Redirigiendo...';
      
      console.log('🚀 Login exitoso, iniciando redirección inmediata...');
      
      // Redirección inmediata
      this.router.navigate(['/dashboard']).then(
        (success) => {
          console.log('✅ Navegación exitosa:', success);
        },
        (error) => {
          console.error('❌ Error en navegación:', error);
          // Si falla, intentar con window.location
          console.log('🔄 Intentando con window.location...');
          window.location.href = '/dashboard';
        }
      );

    } catch (error: any) {
      console.log('❌ Excepción en onLogin:', error);
      this.messageType = 'error';
      this.message = 'Error de autenticación: ' + (error.message || 'Error desconocido');
    } finally {
      console.log('🏁 onLogin() - FINAL');
      this.loading = false;
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }
}
