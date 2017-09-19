import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { Observable } from 'rxjs/Observable';

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
    const response = await fetch('https://demo-2.zpush.io/zbo/auth/whoami', {
      credentials: 'include',
    });
    const whoami = await response.json();
    return whoami.businesses.map(businessId => ({
      businessId,
      name: businessId,
    }));
  }
}
