import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Credentials } from './credentials.interface';

@Injectable()
export class IsAuthenticated implements CanActivate {
  constructor(private router: Router) {}
  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean> {
    try {
      const credentials = JSON.parse(
        sessionStorage.getItem('zp:devtools:credentials'),
      ) as Credentials;
      const response = await fetch(`${credentials.apiUrl}/zbo/auth/whoami`, {
        credentials: 'include',
      });
      const whoami = await response.json();
      return true;
    } catch (e) {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
