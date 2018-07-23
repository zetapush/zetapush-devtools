import { Injectable } from '@angular/core';

import { NGXLogger } from 'ngx-logger';

import { PreferencesStorage } from '../services/preferences-storage.service';
import { getSecureUrl, shuffle } from '../../utils';
import { ErrorModule } from '../../error/error.module';

@Injectable({
  providedIn: 'root',
})
export class SandboxService {
  constructor(
    private preferences: PreferencesStorage,
    private logger: NGXLogger,
  ) {}

  async getSandboxes(): Promise<any> {
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

  async getSandboxInfo(businessId: string, deploymentId: string): Promise<any> {
    const credentials = this.preferences.getCredentials();
    const url = getSecureUrl(
      `${credentials.apiUrl}/zbo/orga/item/info/${businessId}/${deploymentId}`,
    );
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });
    const { content } = await response.json();
    console.log(content);
    // return content.map(({ businessId, name }) => ({ businessId, name }));
  }

  async getSandboxServices(sandboxId: string) {
    const credentials = this.preferences.getCredentials();
    const baseUrl = getSecureUrl(
      `${credentials.apiUrl}/zbo/orga/item/list/${sandboxId}`,
    );
    let { content, pagination } = await this.request(baseUrl);
    let items = [...content];

    while (!pagination.last) {
      const response = await this.request(baseUrl, pagination.number + 1);
      content = response.content;
      pagination = response.pagination;
      items = [...items, ...content];
    }
    this.logger.log('SandboxService::listItems', items);
    const services = items
      .filter(({ itemId, type }) => itemId === 'macro' && type === 'SERVICE')
      .map(({ deploymentId }) => deploymentId);
    this.logger.log('SandboxService::resolve', services);

    return services;
  }

  // retourne une promesse de json du retour pour la requête faite
  async getSandboxErrorPaginatedList(sandboxId: string, page = 0) {
    const servers = await this.servers(sandboxId);
    const server = shuffle(servers); //?

    const url = `${getSecureUrl(
      `${server}/rest/b2b/errors/${sandboxId}`,
    )}?page=${page}`;

    const credentials = this.preferences.getCredentials();

    return fetch(url, {
      headers: {
        'X-Authorization': JSON.stringify(credentials),
      },
    }).then((response) => response.json());
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

  async servers(sandboxId: string): Promise<string[]> {
    const credentials = this.preferences.getCredentials();
    const url = getSecureUrl(
      `${credentials.apiUrl}/zbo/pub/business/${sandboxId}`,
    );
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });
    const { servers } = await response.json();
    this.logger.log('DebugStatus::servers', servers);

    return servers as string[];
  }
}
