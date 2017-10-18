import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { PreferencesStorage } from './preferences-storage.service';
import { getSecureUrl } from './utils';

export interface Sandbox {
  businessId: string;
  name?: string;
}

@Injectable()
export class SandboxesResolver implements Resolve<Sandbox[]> {
  constructor(private preferences: PreferencesStorage) {}
  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<Sandbox[]> {
    console.log('SandboxesResolver::resolve', route);
    const credentials = this.preferences.getCredentials();
    const url = getSecureUrl(
      `${credentials.apiUrl}/zbo/orga/business/list/mine`,
    );
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });
    const { content } = await response.json();
    return content.map(({ businessId, name }) => ({ businessId, name }));
  }
}
