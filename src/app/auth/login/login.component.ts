import { Component, Injector, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NGXLogger } from 'ngx-logger';

import { ENVIRONMENT_ID } from '../../env.module';
import { Platform } from '../../api/interfaces/environment.interface';
import { Credentials } from '../../api/interfaces/credentials.interface';
import { AuthService } from './../../api/services/auth.service';

const CUSTOM_API_URL = '<custom>';

@Component({
  selector: 'zp-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
})
export class LoginComponent {
  platforms: Platform[];
  connecting = false;

  @ViewChild(NgForm) form: NgForm;

  constructor(
    private logger: NGXLogger,
    injector: Injector,
    private authService: AuthService,
  ) {
    this.platforms = injector.get(ENVIRONMENT_ID).plateforms;
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
        const response = await this.authService.login(credentials);

        const data = response.json();
        this.logger.log('data', data);
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
