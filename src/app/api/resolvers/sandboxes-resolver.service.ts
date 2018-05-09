import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { Observable } from 'rxjs';

import { NGXLogger } from 'ngx-logger';

import { PreferencesStorage } from '../services/preferences-storage.service';
import { getSecureUrl } from '../../utils';
import { Sandbox } from '../interfaces/sandbox.interface';
import { SandboxService } from '../services/sandbox.service';

@Injectable()
export class SandboxesResolver implements Resolve<Sandbox[]> {
  constructor(
    private preferences: PreferencesStorage,
    private logger: NGXLogger,
    private sandboxeService: SandboxService,
  ) {}
  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<Sandbox[]> {
    this.logger.log('SandboxesResolver::resolve', route);

    return await this.sandboxeService.getSandboxes();
  }
}
