import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { NGXLogger } from 'ngx-logger';

import { PreferencesStorage } from '../services/preferences-storage.service';
import { getSecureUrl } from '../../utils';
import { Sandbox } from '../interfaces/sandbox.interface';

@Injectable()
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
