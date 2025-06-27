import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';

/**
 * Servicio de autenticación para gestionar login, logout y token JWT.
 * Simula la autenticación y el manejo de token en sessionStorage.
 *
 * Cuando se integre un backend real, reemplazar la lógica de simulación por peticiones HTTP.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  /**
   * Usuario autenticado actualmente (simulado).
   * Cuando haya backend, este dato puede venir del backend o decodificarse del token.
   */
  private userSubject = new BehaviorSubject<{ username: string, role: string } | null>(null);

  /**
   * Realiza el login del usuario.
   * Si las credenciales son correctas (simulación), guarda un token en sessionStorage.
   *
   * @param credentials Objeto con username y password.
   * @returns Observable con el usuario autenticado y el token, o null si falla.
   */
  login({ username, password }: { username: string, password: string }): Observable<any> {
    if (username === 'admin' && password === 'admin') {
      const user = { username, role: 'admin' };
      this.userSubject.next(user);
      const fakeToken = 'fake-jwt-token';
      sessionStorage.setItem('token', fakeToken);
      return of({ ...user, token: fakeToken });
    }
    return of(null);
  }

  /**
   * Cierra la sesión del usuario.
   * Elimina el usuario y el token del sessionStorage.
   */
  logout() {
    console.log('[AuthService] Logout called. User before logout:', this.userSubject.value);
    this.userSubject.next(null);
    sessionStorage.removeItem('token');
    console.log('[AuthService] Logout complete. User after logout:', this.userSubject.value);
  }

  /**
   * Obtiene el token JWT almacenado en sessionStorage.
   * @returns El token JWT o null si no existe.
   */
  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  /**
   * Indica si hay un usuario autenticado actualmente.
   * @returns true si hay usuario autenticado, false en caso contrario.
   */
  isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }

  hasRole(role: string): boolean {
    return this.userSubject.value?.role === role;
  }

  getUser() {
    return this.userSubject.value;
  }

  getUser$() {
    return this.userSubject.asObservable();
  }
}
