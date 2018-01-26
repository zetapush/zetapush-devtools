import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { PreferencesStorage } from '../services/preferences-storage.service';
import { getSecureUrl } from '../../utils';

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
      const url = getSecureUrl(`${credentials.apiUrl}/zbo/auth/whoami`);
      const response = await fetch(url, {
        credentials: 'include',
      });
      const whoami = await response.json();
      return true;
    } catch (e) {
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}
