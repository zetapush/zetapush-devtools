import { NgModule } from '@angular/core';
import {
  MdButtonModule,
  MdCheckboxModule,
  MdFormFieldModule,
  MdInputModule,
  MdListModule,
  MdOptionModule,
  MdSelectModule,
  MdSortModule,
  MdTableModule,
} from '@angular/material';

@NgModule({
  imports: [
    MdButtonModule,
    MdCheckboxModule,
    MdFormFieldModule,
    MdInputModule,
    MdListModule,
    MdOptionModule,
    MdSelectModule,
    MdTableModule,
  ],
  exports: [
    MdButtonModule,
    MdCheckboxModule,
    MdFormFieldModule,
    MdInputModule,
    MdListModule,
    MdOptionModule,
    MdSelectModule,
    MdTableModule,
  ],
})
export class UiModule {}
