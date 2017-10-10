import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { ENVIRONMENT_ID } from './env.module';
import { Platform } from './environment.interface';
import { Credentials } from './credentials.interface';

@Component({
  selector: 'zp-login-view',
  template: `
  <form (ngSubmit)="onSubmit(form)" novalidate #form="ngForm">
    <mat-card *ngIf="!connecting">
      <mat-card-title>Login</mat-card-title>
      <mat-card-content>
        <mat-form-field>
          <input matInput placeholder="Username" name="username" type="text" required ngModel>
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="Password" name="password" type="password" required ngModel>
        </mat-form-field>
        <mat-select placeholder="Api Url" name="apiUrl" required ngModel>
          <mat-option *ngFor="let platform of platforms" [value]="platform.url">
            {{ platform.name }}
          </mat-option>
        </mat-select>
      </mat-card-content>
      <mat-card-actions align="end">
        <button mat-raised-button>Connect</button>
      </mat-card-actions>
    </mat-card>
    <mat-card *ngIf="connecting">
      <mat-card-title>Connecting ...</mat-card-title>
      <mat-card-content>
        <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
      </mat-card-content>
    </mat-card>
  </form>
  `,
  styles: [`
    mat-card {
      max-width: 50vw;
      margin: auto;
    }
    mat-progress-spinner {
      margin: auto;
    }
    mat-card-content {
      display: flex;
      flex-direction: column;
    }
    mat-card-content > * {
      width: 100%;
    }
  `],
})
export class LoginViewComponent {
  platforms: Platform[];
  connecting = false;

  constructor(private router: Router, injector: Injector) {
    this.platforms = injector.get(ENVIRONMENT_ID).plateforms;
  }

  async onSubmit({ value, valid }: { value: Credentials; valid: boolean }) {
    console.log('LoginComponent::onSubmit', value, valid);

    if (valid) {
      sessionStorage.setItem('zp:devtools:credentials', JSON.stringify(value));
      this.connecting = true;
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
        this.connecting = false;
        console.error('error', e);
      }
    }
  }
}
