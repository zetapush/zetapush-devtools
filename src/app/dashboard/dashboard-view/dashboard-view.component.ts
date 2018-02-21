import { Component } from '@angular/core';

@Component({
  selector: 'zp-dashboard-view',
  styleUrls: ['dashboard-view.component.scss'],
  template: `
    <div class="dashboard">
      <img src="../../../assets/zt_logo.png" title="ZetaPush">
      <mat-icon>developer_mode</mat-icon>
    </div>
  `,
})
export class DashboardViewComponent {
  constructor() {}
}
