import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';

// Pop-up
import { PopupComponent } from '../pop-up/popup.component';
import { MatDialog } from '@angular/material/dialog';

export interface CanDeactivateComponent {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class CanDeactivateGuard
  implements CanDeactivate<CanDeactivateComponent> {
  constructor(public dialog: MatDialog) {}

  changeView: boolean = false;

  canDeactivate() {
    const dialogRef = this.dialog.open(PopupComponent, { width: '500px' });
    console.log('CD works');
    return this.changeView;
  }
}
