import { Component } from '@angular/core';

import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';
import { AuthService } from './api/services/auth.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'zp-root',
  template: `
    <zp-header *ngIf="isLoggedIn$ | async"></zp-header>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  isLoggedIn$: Observable<boolean>;

  constructor(
    authService: AuthService,
    analytics: Angulartics2GoogleTagManager,
  ) {
    this.isLoggedIn$ = authService.isLoggedIn();
  }
}
