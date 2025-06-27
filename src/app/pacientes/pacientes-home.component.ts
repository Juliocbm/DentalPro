import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pacientes-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-body">
      <div class="container-xl">
        <div class="card mt-4">
          <div class="card-header">
            <h3 class="card-title">Pacientes</h3>
          </div>
          <div class="table-responsive">
            <table class="table card-table table-vcenter table-hover text-nowrap">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Edad</th>
                  <th>Email</th>
                  <th class="w-1">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let paciente of pacientes">
                  <td>{{ paciente.nombre }}</td>
                  <td>{{ paciente.apellido }}</td>
                  <td>{{ paciente.edad }}</td>
                  <td>{{ paciente.email }}</td>
                  <td>
                    <span class="dropdown">
                      <button class="btn dropdown-toggle align-text-top btn-sm" data-bs-toggle="dropdown">
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
                      </button>
                      <div class="dropdown-menu dropdown-menu-end">
                        <a class="dropdown-item" (click)="editarPaciente(paciente)">
                          <svg xmlns="http://www.w3.org/2000/svg" class="icon me-1" width="18" height="18" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 6l3 3l-9 9h-3v-3z" /><path d="M18.5 4.5a2.121 2.121 0 0 1 3 3l-1.5 1.5l-3 -3l1.5 -1.5" /></svg>
                          Editar
                        </a>
                        <a class="dropdown-item text-danger" (click)="eliminarPaciente(paciente)">
                          <svg xmlns="http://www.w3.org/2000/svg" class="icon me-1" width="18" height="18" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><line x1="4" y1="7" x2="20" y2="7" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                          Eliminar
                        </a>
                      </div>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PacientesHomeComponent {
  pacientes = [
    { nombre: 'Juan', apellido: 'Pérez', edad: 30, email: 'juan.perez@mail.com' },
    { nombre: 'María', apellido: 'Gómez', edad: 25, email: 'maria.gomez@mail.com' },
    { nombre: 'Carlos', apellido: 'López', edad: 40, email: 'carlos.lopez@mail.com' },
    { nombre: 'Ana', apellido: 'Martínez', edad: 35, email: 'ana.martinez@mail.com' }
  ];

  editarPaciente(paciente: any) {
    alert('Editar paciente: ' + paciente.nombre);
  }

  eliminarPaciente(paciente: any) {
    if (confirm('¿Seguro que deseas eliminar a ' + paciente.nombre + '?')) {
      this.pacientes = this.pacientes.filter(p => p !== paciente);
    }
  }
}

