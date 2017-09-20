import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Sandbox } from './sandboxes-resolver.service';

@Component({
  selector: 'zp-sandboxes-view',
  template: `
    <md-list>
      <md-list-item *ngFor="let sandbox of sandboxes">
        <a [routerLink]="['/trace', sandbox.businessId]">{{sandbox.businessId}}</a>
      </md-list-item>
    </md-list>
  `,
  styles: [],
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
