import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="dashboard-container">
      <h1>Bienvenido al Dashboard</h1>
      <p>Este es el panel principal tras iniciar sesión.</p>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 60vh;
      text-align: center;
    }
    h1 {
      color: #1976d2;
    }
  `]
})
export class DashboardComponent {}
