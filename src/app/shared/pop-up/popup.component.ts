import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'zp-popup',
  templateUrl: 'popup-view.component.html',
  styleUrls: ['./popup-view.component.css'],
})
export class PopupComponent {
  answere: boolean;

  constructor(public dialogRef: MatDialogRef<PopupComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSetTrue(): void {
    this.answere = true;
  }
  OnSetFalse(): void {
    this.answere = false;
  }
}
