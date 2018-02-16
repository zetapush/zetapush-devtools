import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { NGXLogger } from 'ngx-logger';

import { PreferencesStorage } from '../services/preferences-storage.service';
import { getSecureUrl } from '../../utils';
import { Sandbox } from '../interfaces/sandboxe.interface';

@Injectable()
export class SandboxeService {
  constructor(
    private preferences: PreferencesStorage,
    private logger: NGXLogger,
  ) {}

  async getSandboxes() {
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
