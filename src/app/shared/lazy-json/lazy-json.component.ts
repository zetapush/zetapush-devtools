import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'zp-lazy-json',
  template: `
    <div class="LazyJson" [ngClass]="{'LazyJson--Hidden': !show }" >
      <button mat-icon-button (click)="onLazyClick()">
        <mat-icon aria-label="Export content">import_export</mat-icon>
      </button>
      <button mat-icon-button *ngIf="show" ngxClipboard [cbContent]="json" (cbOnSuccess)="onThrowSnackbar()">
        <mat-icon aria-label="Copy content">file_copy</mat-icon>
      </button>
      <ngx-json-viewer *ngIf="show" [json]="value" [expanded]="false"></ngx-json-viewer>
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
  show = false;
  json: any;
  constructor(private snackBar: MatSnackBar) {}
  ngOnChanges() {
    this.json = JSON.stringify(this.value, null, 2);
  }
  onLazyClick() {
    this.show = !this.show;
  }
  onThrowSnackbar() {
    this.snackBar.open('JSON content copied to clipboard', '', {
      duration: 800,
    });
  }
}
