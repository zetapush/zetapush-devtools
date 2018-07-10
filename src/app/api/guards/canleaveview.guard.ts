import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

// Pop-up
import { PopupComponent } from '../../shared/pop-up/popup.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable()
export class CanLeaveViewGuard implements CanDeactivate<any> {
  constructor(public dialog: MatDialog) {}
  canDeactivate(): Promise<boolean> {
    const dialogRef = this.dialog.open(PopupComponent, { width: '33vw' });

    return dialogRef
      .beforeClose()
      .toPromise()
      .then((answere) => answere === 'confirm');
  }
}
