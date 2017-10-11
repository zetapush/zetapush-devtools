import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Sandbox } from './sandboxes-resolver.service';
/**
    <mat-list>
      <h3 mat-subheader>Folders</h3>
      <mat-list-item *ngFor="let sandbox of sandboxes">
        <mat-icon mat-list-icon>folder</mat-icon>
        <p mat-line>
          <a [routerLink]="['/trace', sandbox.businessId]">({{sandbox.businessId}}) -- {{sandbox.name}}</a>
        </p>
      </mat-list-item>
    </mat-list>
 */
@Component({
  selector: 'zp-sandboxes-view',
  template: `
  <mat-list>
    <h3 mat-subheader>Sandboxes</h3>
    <mat-list-item *ngFor="let sandbox of sandboxes" [routerLink]="['/trace', sandbox.businessId]">
      <mat-icon mat-list-icon>folder</mat-icon>
      <h4 mat-line><strong>{{sandbox.name}}</strong></h4>
      <p mat-line>{{sandbox.businessId}}</p>
    </mat-list-item>
  </mat-list>
  `,
  styles: [
    `
    [mat-list-icon] {
      color: rgba(0, 0, 0, 0.54);
    }
    mat-list-item {
      cursor: pointer;
    }
  `,
  ],
})
export class SandboxesViewComponent {
  sandboxes: Sandbox[] = [];
  constructor(private route: ActivatedRoute) {
    route.data.subscribe(({ sandboxes = [] } = {}) => {
      console.log('SandboxesComponent', sandboxes);
      this.sandboxes = sandboxes;
    });
  }
}
