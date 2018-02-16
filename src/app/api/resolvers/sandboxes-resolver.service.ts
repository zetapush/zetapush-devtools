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
import { Sandbox } from '../interfaces/sandboxe.interface';
import { SandboxeService } from '../services/sandboxe.service';

@Injectable()
export class SandboxesResolver implements Resolve<Sandbox[]> {
  constructor(
    private preferences: PreferencesStorage,
    private logger: NGXLogger,
    private sandboxeService: SandboxeService,
  ) {}
  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<Sandbox[]> {
    this.logger.log('SandboxesResolver::resolve', route);

    return await this.sandboxeService.getSandboxes();
  }
}
