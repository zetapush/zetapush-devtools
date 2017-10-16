import { Injectable } from '@angular/core';

import { Credentials } from './credentials.interface';

@Injectable()
export class PreferencesStorage {
  constructor() {}
  setCredentials(credentials: Credentials) {
    return credentials;
  }
  getCredentials(): Credentials {
    const credentials = JSON.parse(
      sessionStorage.getItem('zp:devtools:credentials'),
    ) as Credentials;
    return credentials;
  }
}
