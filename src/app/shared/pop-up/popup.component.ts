import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'zp-popup',
  templateUrl: 'popup-view.component.html',
  styleUrls: ['./popup-view.component.css'],
})
export class PopupComponent {
  constructor(public dialogRef: MatDialogRef<PopupComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close('confirm');
  }
}
