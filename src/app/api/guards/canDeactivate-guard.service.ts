import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SharedModule } from '../../shared/shared.module';

// Pop-up
import { PopupComponent } from '../../shared/pop-up/popup.component';
import { MatDialog } from '@angular/material/dialog';

export interface CanDeactivateComponent {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CanDeactivateGuard
  implements CanDeactivate<CanDeactivateComponent> {
  constructor(public dialog: MatDialog) {}

  EnableChangeView: boolean = false;

  canDeactivate() {
    const dialogRef = this.dialog.open(PopupComponent, { width: '500px' });

    return dialogRef
      .beforeClose()
      .toPromise()
      .then((answere) => {
        if (answere === 'confirm') {
          this.EnableChangeView = true;
        }
        return this.EnableChangeView;
      });
  }
}
