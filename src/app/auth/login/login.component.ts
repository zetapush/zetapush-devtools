import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { NGXLogger } from 'ngx-logger';

import { ENVIRONMENT_ID } from '../../env.module';
import { Platform } from '../../api/interfaces/environment.interface';
import { Credentials } from '../../api/interfaces/credentials.interface';
import { getSecureUrl } from '../../utils';

const CUSTOM_API_URL = '<custom>';

@Component({
  selector: 'zp-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
})
export class LoginComponent implements OnInit {
  platforms: Platform[];
  connecting = false;

  @ViewChild(NgForm) form: NgForm;

  constructor(
    private router: Router,
    private logger: NGXLogger,
    injector: Injector,
  ) {
    this.platforms = injector.get(ENVIRONMENT_ID).plateforms;
  }

  ngOnInit() {
    this.logger.log('LoginComponent::ngOnInit', this.form);
  }

  async onSubmit({ value, valid }: { value: Credentials; valid: boolean }) {
    this.logger.log('LoginComponent::onSubmit', value, valid);

    if (valid) {
      const { apiUrl, username, password } = value;
      const credentials = { apiUrl, username, password };
      if (apiUrl === CUSTOM_API_URL) {
        credentials.apiUrl = apiUrl.replace(
          CUSTOM_API_URL,
          this.getNormalizedApiUrl(this.form.value.customApiUrl),
        );
      }
      sessionStorage.setItem(
        'zp:devtools:credentials',
        JSON.stringify(credentials),
      );
      this.connecting = true;
      try {
        const urls = {
          login: getSecureUrl(`${credentials.apiUrl}/zbo/auth/login`),
          logout: getSecureUrl(`${credentials.apiUrl}/zbo/auth/logout`),
        };
        this.logger.log('LoginComponent::onSubmit', urls);
        await fetch(urls.logout, {
          method: 'GET',
          credentials: 'include',
        });
        const response = await fetch(urls.login, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
          credentials: 'include',
        });
        const data = await response.json();
        this.logger.log('data', data);
        this.router.navigate(['/sandboxes']);
      } catch (e) {
        this.connecting = false;
        this.logger.error('error', e);
      }
    }
  }

  isCustomApiUrl(): boolean {
    return this.form.value.apiUrl === CUSTOM_API_URL;
  }

  private getNormalizedApiUrl(apiUrl: string) {
    const END_WITH_SLASH_PATTERN = /.*\/$/;
    return END_WITH_SLASH_PATTERN.test(apiUrl)
      ? apiUrl.substring(0, apiUrl.length - 1)
      : apiUrl;
  }
}
