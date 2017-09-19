import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class IsAuthenticated implements CanActivate {
  constructor(private router: Router) {}
  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean> {
    try {
      const response = await fetch('https://demo-2.zpush.io/zbo/auth/whoami', {
        credentials: 'include',
      });
      const whoami = await response.json();
      const credentials = JSON.parse(
        sessionStorage.getItem('zp:devtools:credentials'),
      );
      return true;
    } catch (e) {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
