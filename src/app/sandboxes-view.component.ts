import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Sandbox } from './sandboxes-resolver.service';

@Component({
  selector: 'zp-sandboxes-view',
  template: `
    <ul>
      <li *ngFor="let sandbox of sandboxes">
        <a [routerLink]="['/trace', sandbox.businessId]">{{sandbox.businessId}}</a>
      </li>
    </ul>
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
