import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="landing-container">
      <h1>Bienvenido</h1>
      <a routerLink="/auth/login" class="btn btn-primary">Iniciar sesión</a>
    </div>
  `,
  styles: [`
    .landing-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 80vh;
      text-align: center;
    }
    .btn {
      margin-top: 2rem;
      padding: 0.75rem 2rem;
      font-size: 1.2rem;
      background: #2196f3;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.2s;
    }
    .btn:hover {
      background: #1769aa;
    }
  `]
})
export class LandingComponent {}
