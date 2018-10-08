import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { PreferencesStorage } from '../services/preferences-storage.service';
import { getSecureUrl } from '../../utils';
import { VersionService } from './version.service';

@Injectable()
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(
    private router: Router,
    private preferences: PreferencesStorage,
    private version: VersionService,
  ) {}

  async login(credentials): Promise<Response> {
    await this.version.assertIsCompatible(credentials);
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
    this.router.navigate(['/dashboard']);

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
      await this.version.assertIsCompatible(credentials);
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
