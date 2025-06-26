import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Aquí puedes importar y exportar componentes/pipes/directivas reutilizables

@NgModule({
  imports: [CommonModule],
  exports: [CommonModule]
})
export class SharedModule {}
