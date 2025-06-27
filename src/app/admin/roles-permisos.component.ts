import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';

interface Permiso {
  nombre: string;
  descripcion: string;
}

interface Rol {
  nombre: string;
  permisos: string[];
}

@Component({
  selector: 'app-roles-permisos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './roles-permisos.component.html',
  styleUrls: ['./roles-permisos.component.scss']
})
export class RolesPermisosComponent {
  permisos: Permiso[] = [
    { nombre: 'ver_dashboard', descripcion: 'Ver dashboard' },
    { nombre: 'gestionar_usuarios', descripcion: 'Gestionar usuarios' },
    { nombre: 'gestionar_pacientes', descripcion: 'Gestionar pacientes' },
    { nombre: 'gestionar_agenda', descripcion: 'Gestionar agenda' },
    { nombre: 'gestionar_finanzas', descripcion: 'Gestionar finanzas' },
    { nombre: 'ver_reportes', descripcion: 'Ver reportes' }
  ];

  roles: Rol[] = [
    { nombre: 'administrador', permisos: ['ver_dashboard', 'gestionar_usuarios', 'gestionar_pacientes', 'gestionar_agenda', 'gestionar_finanzas', 'ver_reportes'] },
    { nombre: 'odontologo', permisos: ['ver_dashboard', 'gestionar_pacientes', 'gestionar_agenda', 'ver_reportes'] },
    { nombre: 'asistente', permisos: ['ver_dashboard', 'gestionar_agenda', 'gestionar_pacientes'] },
    { nombre: 'paciente', permisos: ['ver_dashboard'] }
  ];

  rolesForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.rolesForm = this.fb.group({
      roles: this.fb.array(this.roles.map(rol => this.fb.group({
        nombre: [rol.nombre],
        permisos: this.fb.group(
          Object.fromEntries(this.permisos.map(p => [p.nombre, [rol.permisos.includes(p.nombre)]]))
        )
      })))
    });
  }

  get rolesArray() {
    return this.rolesForm.get('roles') as FormArray;
  }

  guardar() {
    const value = this.rolesForm.value;
    alert('Roles y permisos actualizados!');
  }

  getPermisoControl(rolCtrl: any, permiso: string): FormControl | null {
    const group = rolCtrl.get('permisos');
    return group ? group.get(permiso) as FormControl : null;
  }
}
