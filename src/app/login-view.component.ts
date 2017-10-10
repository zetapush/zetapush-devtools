import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { ENVIRONMENT_ID } from './env.module';
import { Platform } from './environment.interface';
import { Credentials } from './credentials.interface';

@Component({
  selector: 'zp-login-view',
  template: `
    <form (ngSubmit)="onSubmit(form)" novalidate #form="ngForm">
      <md-form-field>
        <input mdInput placeholder="Username" name="username" type="text" required ngModel>
      </md-form-field>
      <md-form-field>
        <input mdInput placeholder="Password" name="password" type="password" required ngModel>
      </md-form-field>
      <md-select placeholder="Api Url" name="apiUrl" required ngModel>
        <md-option *ngFor="let platform of platforms" [value]="platform.url">
          {{ platform.name }}
        </md-option>
      </md-select>
      <button md-raised-button>Validate</button>
    </form>
  `,
  styles: [],
})
export class LoginViewComponent {
  platforms: Platform[];

  constructor(private router: Router, injector: Injector) {
    this.platforms = injector.get(ENVIRONMENT_ID).plateforms;
  }

  async onSubmit({ value, valid }: { value: Credentials; valid: boolean }) {
    console.log('LoginComponent::onSubmit', value, valid);

    if (valid) {
      sessionStorage.setItem('zp:devtools:credentials', JSON.stringify(value));
      try {
        const urls = {
          login: `${value.apiUrl}/zbo/auth/login`,
          logout: `${value.apiUrl}/zbo/auth/logout`,
        };
        console.log('LoginComponent::onSubmit', urls);
        await fetch(urls.logout, {
          method: 'GET',
          body: {},
          credentials: 'include',
        });
        const response = await fetch(urls.login, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(value),
          credentials: 'include',
        });
        const data = await response.json();
        console.log('data', data);
        this.router.navigate(['/sandboxes']);
      } catch (e) {
        console.error('error', e);
      }
    }
  }
}