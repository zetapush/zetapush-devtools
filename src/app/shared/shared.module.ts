import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Feature modules
import { UiModule } from '../ui.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

// Components
import { DebugFormComponent } from './debug-form/debug-form.component';
import { RedirectViewComponent } from './redirect-view/redirect-view.component';
import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { PopupComponent } from './pop-up/popup.component';

// Directives
import { ScrollGlueDirective } from './scroll-glue/scroll-glue.directive';

const COMPONENTS = [
  DebugFormComponent,
  RedirectViewComponent,
  ScrollGlueDirective,
  HeaderComponent,
  SidenavComponent,
  PopupComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    UiModule,
    RouterModule,
    MatButtonToggleModule,
  ],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class SharedModule {}
