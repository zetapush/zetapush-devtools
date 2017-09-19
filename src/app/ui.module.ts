import { NgModule } from '@angular/core';
import {
  MdButtonModule,
  MdCheckboxModule,
  MdFormFieldModule,
  MdInputModule,
  MdOptionModule,
  MdSelectModule,
} from '@angular/material';

@NgModule({
  imports: [
    MdButtonModule,
    MdCheckboxModule,
    MdFormFieldModule,
    MdInputModule,
    MdOptionModule,
    MdSelectModule,
  ],
  exports: [
    MdButtonModule,
    MdCheckboxModule,
    MdFormFieldModule,
    MdInputModule,
    MdOptionModule,
    MdSelectModule,
  ],
})
export class UiModule {}
