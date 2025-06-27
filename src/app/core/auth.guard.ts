import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    console.log('[AuthGuard] canActivate called. isLoggedIn:', this.auth.isLoggedIn());
    if (this.auth.isLoggedIn()) {
      console.log('[AuthGuard] Access granted.');
      return true;
    }
    console.log('[AuthGuard] Access denied. Redirecting to /auth/login');
    return this.router.createUrlTree(['/auth/login']);
  }
}
