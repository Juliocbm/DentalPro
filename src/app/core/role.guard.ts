import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const role = route.data['role'];
    const isLoggedIn = this.auth.isLoggedIn();
    const userHasRole = this.auth.hasRole(role);
    console.log(`[RoleGuard] Route: ${state.url}, Required Role: ${role}, isLoggedIn: ${isLoggedIn}, userHasRole: ${userHasRole}`);

    if (isLoggedIn && userHasRole) {
      console.log('[RoleGuard] Access GRANTED.');
      return true;
    }
    console.log('[RoleGuard] Access DENIED. Redirecting to /auth/login.');
    return this.router.createUrlTree(['/auth/login']);
  }
}
