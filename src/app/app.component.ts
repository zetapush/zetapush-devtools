import { Component } from '@angular/core';

import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';
import { AuthService } from './api/services/auth.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'zp-root',
  template: `
    <div class="zp-layout" *ngIf="isLoggedIn$ | async">
      <zp-header
        (toggledSidenav)="onToggledSidenav($event)">
      </zp-header>

      <zp-sidenav
        [toggle]="toggledSidenav">
      </zp-sidenav>
    </div>

    <router-outlet name="login"></router-outlet>
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
