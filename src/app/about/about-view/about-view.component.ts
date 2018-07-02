import { Component, OnInit } from '@angular/core';

// Angular Matelial
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../../shared/pop-up/popup.component';

@Component({
  selector: 'zp-about-view',
  templateUrl: './about-view.component.html',
  styleUrls: [],
})
export class AboutViewComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  onThrowPop() {
    const dialogRef = this.dialog.open(PopupComponent, { width: '500px' });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }
}
