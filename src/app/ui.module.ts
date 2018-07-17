import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatOptionModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule,
  MatMenuModule,
  MatTooltipModule,
  MatDialogModule,
  MatButtonToggleModule,
  MatPaginatorModule,
} from '@angular/material';

const MODULES = [
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatOptionModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatSidenavModule,
  MatTableModule,
  MatToolbarModule,
  MatMenuModule,
  MatTooltipModule,
  MatDialogModule,
  MatSortModule,
  MatButtonToggleModule,
  MatPaginatorModule,
];

@NgModule({
  imports: [...MODULES],
  exports: [...MODULES],
})
export class UiModule {}
