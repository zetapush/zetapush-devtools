import { Injectable } from '@angular/core';

import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { PreferencesStorage } from './preferences-storage.service';
import { getSecureUrl } from '../../utils';

export interface DebugStatus {
  currentNb: number;
  debug: boolean;
  totalNb: number;
}

@Injectable()
export class DebugStatusApi {
  private realTimeServerUrlList: string[] = [];
  subject = new BehaviorSubject<any>({});

  constructor(
    private preferences: PreferencesStorage,
    private logger: NGXLogger,
  ) {}

  async status(sandboxId: string, deploymentId: string): Promise<DebugStatus> {
    const credentials = this.preferences.getCredentials();
    const servers = await this.servers(sandboxId);

    const getStatusByServer = (server: string): Promise<DebugStatus> => {
      const url = getSecureUrl(
        `${server}/rest/deployed/${sandboxId}/${deploymentId}/debug/status`,
      );
      return fetch(url, {
        headers: {
          'X-Authorization': JSON.stringify(credentials),
        },
      })
        .then(response => response.json())
        .then(({ currentNb, debug, totalNb }) => ({
          currentNb,
          debug,
          totalNb,
        }));
    };

    const requests = servers.map(server => getStatusByServer(server));
    const responses = await Promise.all(requests);

    return responses.reduce(
      (status, next) => {
        status.currentNb += next.currentNb;
        status.debug = status.debug && next.debug;
        status.totalNb += next.totalNb;
        return status;
      },
      {
        currentNb: 0,
        debug: true,
        totalNb: 0,
      },
    );
  }

  async enable(sandboxId: string, deploymentId: string): Promise<boolean> {
    const credentials = this.preferences.getCredentials();
    const servers = await this.servers(sandboxId);
    const enableStatusByServer = (server: string): Promise<any> => {
      const url = getSecureUrl(
        `${server}/rest/deployed/${sandboxId}/${deploymentId}/debug/enable`,
      );
      return fetch(url, {
        headers: {
          'X-Authorization': JSON.stringify(credentials),
        },
      });
    };
    const requests = servers.map(server => enableStatusByServer(server));
    const responses = await Promise.all(requests);

    return responses.reduce(success => {
      return success;
    }, true);
  }

  async disable(sandboxId: string, deploymentId: string) {
    const credentials = this.preferences.getCredentials();
    const servers = await this.servers(sandboxId);
    const enableStatusByServer = (server: string): Promise<any> => {
      const url = getSecureUrl(
        `${server}/rest/deployed/${sandboxId}/${deploymentId}/debug/disable`,
      );
      return fetch(url, {
        headers: {
          'X-Authorization': JSON.stringify(credentials),
        },
      });
    };
    const requests = servers.map(server => enableStatusByServer(server));
    const responses = await Promise.all(requests);

    return responses.reduce(success => {
      return success;
    }, true);
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
