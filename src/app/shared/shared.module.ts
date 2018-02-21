import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Feature modules
import { UiModule } from '../ui.module';

// Components
import { DebugFormComponent } from './debug-form/debug-form.component';
import { StackFilterComponent } from './stack-filter/stack-filter.component';
import { RedirectViewComponent } from './redirect-view/redirect-view.component';
import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from './sidenav/sidenav.component';

// Directives
import { ScrollGlueDirective } from './scroll-glue/scroll-glue.directive';

const COMPONENTS = [
  DebugFormComponent,
  StackFilterComponent,
  RedirectViewComponent,
  ScrollGlueDirective,
  HeaderComponent,
  SidenavComponent,
];

@NgModule({
  imports: [CommonModule, FormsModule, UiModule, RouterModule],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class SharedModule {}
