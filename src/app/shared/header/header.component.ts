import { Component } from '@angular/core';

import { AuthService } from './../../api/services/auth.service';

@Component({
  selector: 'zp-header',
  styleUrls: ['header.component.scss'],
  template: `
    <mat-toolbar class="header">
      <mat-toolbar-row>
        <div class="brand">
          <img src="../../../assets/zt_logo.png" title="ZetaPush">
        </div>
        <span class="space"></span>
        <div>
          <button mat-icon-button matTooltip="Account" [mat-menu-trigger-for]="userMenu" tabindex="-1">
            <mat-icon>account_circle</mat-icon>
          </button>
          <mat-menu #userMenu="matMenu">
            <button
              mat-menu-item
              (click)="logoutUser()">
              <mat-icon>power_settings_new</mat-icon>
              <span>Logout</span>
            </button>
          </mat-menu>
        </div>
      </mat-toolbar-row>
    </mat-toolbar>
  `,
})
export class HeaderComponent {
  constructor(private authService: AuthService) {}

  logoutUser() {
    this.authService.logout();
  }
}
