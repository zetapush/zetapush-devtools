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

@Injectable()
export class ServicesResolver implements Resolve<string[]> {
  constructor(
    private preferences: PreferencesStorage,
    private logger: NGXLogger,
  ) {}
  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<string[]> {
    this.logger.log('ServicesResolver::resolve', route, state);
    const credentials = this.preferences.getCredentials();
    const { sandboxId } = route.params;
    const baseUrl = getSecureUrl(
      `${credentials.apiUrl}/zbo/orga/item/list/${sandboxId}`,
    );
    let { content, pagination } = await this.request(baseUrl);
    let items = [...content];
    this.logger.log('ServicesResolver::listItems', { content, pagination });
    while (!pagination.last) {
      const response = await this.request(baseUrl, pagination.number + 1);
      content = response.content;
      pagination = response.pagination;
      items = [...items, ...content];
      this.logger.log('ServicesResolver::listItems', { content, pagination });
    }
    this.logger.log('ServicesResolver::listItems', items);
    const services = items
      .filter(({ itemId, type }) => itemId === 'macro' && type === 'SERVICE')
      .map(({ deploymentId }) => deploymentId);
    this.logger.log('ServicesResolver::resolve', services);

    const statusUrl = `http://<rt-node>/str/rest/deployed/${sandboxId}/<deployId>/debug/status`;
    return services;
  }

  async request(baseUrl: string, page: number = 0) {
    const url = `${baseUrl}?page=${page}`;
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });
    const { content, ...pagination } = await response.json();
    return { content, pagination };
  }
}
