import { Component, Input } from '@angular/core';

@Component({
  selector: 'zp-lazy-json',
  template: `
    <div class="LazyJson" [ngClass]="{'LazyJson--Hidden': !show }" >
      <pre *ngIf="show">{{value | json}}</pre>
      <button *ngIf="!show" mat-button (click)="onLazyClick()">
        <mat-icon>visibility</mat-icon>
        <span>{{placeholder}}</span>
      </button>
    </div>
  `,
  styles: [
    `
    .LazyJson {
    }
    .LazyJson--Hidden {
    }
  `,
  ],
})
export class LazyJsonComponent {
  @Input() value: any;
  @Input() placeholder = 'Show';

  show = false;

  onLazyClick() {
    this.show = true;
  }
}
