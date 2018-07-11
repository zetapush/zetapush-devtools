import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'zp-lazy-json',
  template: `
    <div class="LazyJson" [ngClass]="{'LazyJson--Hidden': !show }" >
      <pre *ngIf="show">{{value | json}}</pre>
      <button mat-icon-button *ngIf="show" ngxClipboard [cbContent]="json" (click)="onThrowSnackbar()">
        <mat-icon aria-label="Modez, copy dat json!">file_copy</mat-icon>
      </button>
      <button *ngIf="!show" mat-button (click)="onLazyClick()">
        <mat-icon>visibility</mat-icon>
        <span>{{placeholder}}</span>
      </button>
    </div>
  `,
  styles: [
    `
      .LazyJson {
        display: flex;
        align-items: center;
      }
      .LazyJson--Hidden {
      }
    `,
  ],
})
export class LazyJsonComponent {
  @Input() value: any;
  @Input() placeholder = 'Show';
  json: any;
  show = false;

  ngOnChanges() {
    this.json = JSON.stringify(this.value);
  }

  constructor(private snackBar: MatSnackBar) {}

  onLazyClick() {
    this.show = true;
  }

  onThrowSnackbar() {
    this.snackBar.open('JSON content copied to clipboard', '', {
      duration: 800,
    });
  }
}
