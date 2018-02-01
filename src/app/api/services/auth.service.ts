import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { PreferencesStorage } from '../services/preferences-storage.service';
import { getSecureUrl } from '../../utils';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(
    private router: Router,
    private preferences: PreferencesStorage,
  ) {}

  async login(credentials): Promise<Response> {
    const response = await fetch(
      getSecureUrl(`${credentials.apiUrl}/zbo/auth/login`),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
      },
    );

    this.loggedIn.next(true);
    this.router.navigate(['/sandboxes']);

    return response;
  }

  async logout() {
    const credentials = this.preferences.getCredentials();
    await fetch(getSecureUrl(`${credentials.apiUrl}/zbo/auth/logout`), {
      method: 'GET',
      credentials: 'include',
    });

    this.loggedIn.next(false);
    this.router.navigate(['/auth/login']);
  }

  async checkCredentials(): Promise<boolean> {
    try {
      const credentials = this.preferences.getCredentials();
      const url = getSecureUrl(`${credentials.apiUrl}/zbo/auth/whoami`);
      const response = await fetch(url, {
        credentials: 'include',
      });
      const whoami = await response.json();
      this.loggedIn.next(true);
      return true;
    } catch (e) {
      this.loggedIn.next(false);
      return false;
    }
  }

  isLoggedIn() {
    return this.loggedIn;
  }
}
