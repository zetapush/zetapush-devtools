import { Component, OnInit } from '@angular/core';

import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';
import { AuthService } from './api/services/auth.service';
import { Observable } from 'rxjs/Observable';
import { SandboxeService } from './api/services/sandboxe.service';
import { Sandbox } from './api/interfaces/sandboxe.interface';

@Component({
  selector: 'zp-root',
  template: `
    <div class="zp-layout" *ngIf="isLoggedIn$ | async">
      <zp-header
        (toggledSidenav)="onToggledSidenav($event)">
      </zp-header>

      <zp-sidenav
        [toggle]="toggledSidenav"
        [sandboxes]="this.sandboxes">
      </zp-sidenav>
    </div>

    <router-outlet name="login"></router-outlet>
  `,
})
export class AppComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  toggledSidenav = true;
  sandboxes: Array<Sandbox> = [];

  constructor(
    authService: AuthService,
    analytics: Angulartics2GoogleTagManager,
    private sandboxeService: SandboxeService,
  ) {
    this.isLoggedIn$ = authService.isLoggedIn();
  }

  ngOnInit() {
    this.sandboxeService.getSandboxes().then(sandboxes => {
      this.sandboxes = sandboxes;
    });
  }

  onToggledSidenav(event: boolean) {
    this.toggledSidenav = event;
  }
}
