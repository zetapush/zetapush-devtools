import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NGXLogger } from 'ngx-logger';

import { Sandbox } from '../../api/interfaces/sandboxe.interface';

@Component({
  selector: 'zp-sandboxes-view',
  styleUrls: ['sandboxes-view.component.scss'],
  template: `
    <div class="sandboxes-container">
      <mat-list>
        <h3 mat-subheader>Sandboxes</h3>
        <mat-list-item *ngFor="let sandbox of sandboxes" [routerLink]="['/traces', sandbox.businessId]">
          <mat-icon mat-list-icon>folder</mat-icon>
          <h4 mat-line><strong>{{sandbox.name}}</strong></h4>
          <p mat-line>{{sandbox.businessId}}</p>
        </mat-list-item>
      </mat-list>

      <mat-list>
        <h3 mat-subheader>Sandboxes terminal</h3>
        <mat-list-item *ngFor="let sandbox of sandboxes" [routerLink]="['/terminal', sandbox.businessId]">
          <mat-icon mat-list-icon>subtitles</mat-icon>
          <h4 mat-line><strong>{{sandbox.name}}</strong></h4>
          <p mat-line>{{sandbox.businessId}}</p>
        </mat-list-item>
      </mat-list>
    </div>
  `,
})
export class SandboxesViewComponent {
  sandboxes: Sandbox[] = [];
  constructor(private route: ActivatedRoute, private logger: NGXLogger) {
    route.data.subscribe(({ sandboxes = [] } = {}) => {
      this.logger.log('SandboxesComponent', sandboxes);
      this.sandboxes = sandboxes;
    });
  }
}
