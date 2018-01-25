import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { NGXLogger } from 'ngx-logger';

import { PreferencesStorage } from '../services/preferences-storage.service';
import { getSecureUrl } from '../../utils';

export interface SandboxStatus {
  name: string;
  version: string;
  exists: boolean;
  up: boolean;
  businessId: string;
}

@Injectable()
export class SandboxStatusResolver implements Resolve<SandboxStatus> {
  constructor(
    private preferences: PreferencesStorage,
    private logger: NGXLogger,
  ) {}
  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<SandboxStatus> {
    this.logger.log('SandboxStatusResolver::resolve', route);
    const credentials = this.preferences.getCredentials();
    const url = getSecureUrl(
      `${credentials.apiUrl}/zbo/orga/business/status/${
        route.params.sandboxId
      }`,
    );
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });
    const status = await response.json();
    return status;
  }
}
