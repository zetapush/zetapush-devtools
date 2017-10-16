import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { PreferencesStorage } from './preferences-storage.service';

@Injectable()
export class IsAuthenticated implements CanActivate {
  constructor(
    private preferences: PreferencesStorage,
    private router: Router,
  ) {}
  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean> {
    try {
      const credentials = this.preferences.getCredentials();
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
