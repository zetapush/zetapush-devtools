import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { Credentials } from './credentials.interface';

export interface Sandbox {
  businessId: string;
  name?: string;
}

@Injectable()
export class SandboxesResolver implements Resolve<Sandbox[]> {
  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<Sandbox[]> {
    console.log('SandboxesResolver::resolve', route);
    const credentials = JSON.parse(
      sessionStorage.getItem('zp:devtools:credentials'),
    ) as Credentials;
    const url = `${credentials.apiUrl}/zbo/orga/business/list/mine`;
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });
    const { content } = await response.json();
    return content.map(({ businessId, name }) => ({ businessId, name }));
  }
}
