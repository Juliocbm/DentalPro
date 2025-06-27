import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  loading = false;
  msg = '';
  errorMsg = '';
  token: string;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private auth: AuthService) {
    this.token = this.route.snapshot.params['token'];
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.resetForm.invalid || this.resetForm.value.password !== this.resetForm.value.confirm) return;
    this.loading = true;
    this.auth.resetPassword(this.token, this.resetForm.value.password).subscribe({
      next: () => {
        this.msg = 'Contraseña restablecida correctamente';
        this.loading = false;
      },
      error: err => {
        this.errorMsg = err.error?.message || 'Error al restablecer';
        this.loading = false;
      }
    });
  }
}
