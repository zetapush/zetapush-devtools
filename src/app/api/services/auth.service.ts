import { Injectable } from '@angular/core';

import { PreferencesStorage } from '../services/preferences-storage.service';
import { getSecureUrl } from '../../utils';

@Injectable()
export class AuthService {
  constructor(private preferences: PreferencesStorage) {}

  async login(credentials, loginUrl): Promise<Response> {
    return await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });
  }

  async logout(logoutUrl) {
    await fetch(logoutUrl, {
      method: 'GET',
      credentials: 'include',
    });
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const credentials = this.preferences.getCredentials();
      const url = getSecureUrl(`${credentials.apiUrl}/zbo/auth/whoami`);
      const response = await fetch(url, {
        credentials: 'include',
      });
      const whoami = await response.json();
      return true;
    } catch (e) {
      return false;
    }
  }
}
