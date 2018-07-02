import { Component, Output, EventEmitter } from '@angular/core';

import { AuthService } from './../../api/services/auth.service';

@Component({
  selector: 'zp-header',
  styleUrls: ['header.component.scss'],
  template: `
    <mat-toolbar class="header">
      <mat-toolbar-row>
        <div class="brand" (click)="toggleSidenav()">
          <img src="../../../assets/zt_logo.png" title="ZetaPush">
        </div>
        <span class="space"></span>
        <div id="about-link">
           <a routerLink="/about">About</a>
        </div>
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
  toggled = true;

  @Output() toggledSidenav = new EventEmitter<boolean>();

  constructor(private authService: AuthService) {}

  logoutUser() {
    this.authService.logout();
  }

  /**
   * Launch an event to open or close the sidenav
   */
  toggleSidenav() {
    this.toggled = !this.toggled;
    this.toggledSidenav.emit(this.toggled);
  }
}
