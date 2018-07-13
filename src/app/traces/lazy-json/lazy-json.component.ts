import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'zp-lazy-json',
  template: `
    <div class="LazyJson" [ngClass]="{'LazyJson--Hidden': !show }" >
      <button *ngIf="show" mat-button (click)="onLazyClick()" class="JSON">
        <pre *ngIf="show">{{value | json}}</pre>
      </button>  
      <button mat-icon-button *ngIf="show" ngxClipboard [cbContent]="json" (cbOnSuccess)="onThrowSnackbar()">
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
      }
      .LazyJson--Hidden {
        align-items: center;
      }
      .JSON {
        text-align: left;
        font-weight: bold;
        line-height: 16px;
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
    this.json = JSON.stringify(this.value, null, 2);
  }

  constructor(private snackBar: MatSnackBar) {}

  onLazyClick() {
    this.show = !this.show;
  }

  onThrowSnackbar() {
    this.snackBar.open('JSON content copied to clipboard', '', {
      duration: 800,
    });
  }
}
