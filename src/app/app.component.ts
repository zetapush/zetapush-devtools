import { Component } from '@angular/core';

import { Angulartics2GoogleTagManager } from 'angulartics2';

@Component({
  selector: 'zp-root',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {
  constructor(analytics: Angulartics2GoogleTagManager) {}
}
