import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-simple-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      font-family: Arial, sans-serif;
    ">
      <h1 style="
        color: white;
        font-size: 48px;
        margin: 0 0 20px 0;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
      ">¡FUNCIONA!</h1>
      <p style="
        color: white;
        font-size: 24px;
        margin: 0 0 30px 0;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
      ">El routing y los componentes están funcionando correctamente</p>
      <button (click)="testClick()" style="
        padding: 15px 30px;
        background: white;
        color: #333;
        border: none;
        border-radius: 8px;
        font-size: 18px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        transition: transform 0.2s;
      " 
      onmouseover="this.style.transform='scale(1.05)'" 
      onmouseout="this.style.transform='scale(1)'">
        Hacer Click de Prueba
      </button>
      <div *ngIf="clicked" style="
        margin-top: 20px;
        color: white;
        font-size: 20px;
        font-weight: bold;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        animation: bounce 0.5s ease-in-out;
      ">
        ✅ ¡Angular está funcionando perfectamente!
      </div>
    </div>
  `,
  styles: [`
    @keyframes bounce {
      0%, 20%, 60%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-10px);
      }
      80% {
        transform: translateY(-5px);
      }
    }
  `]
})
export class SimpleLoginComponent {
  clicked = false;

  constructor() {
    console.log('🚀 SimpleLoginComponent constructor called!');
  }

  ngOnInit() {
    console.log('🎯 SimpleLoginComponent ngOnInit called!');
  }

  testClick() {
    this.clicked = true;
    console.log('🎉 Simple login component button clicked!');
    alert('¡El botón funciona! Angular está corriendo correctamente.');
  }
}
