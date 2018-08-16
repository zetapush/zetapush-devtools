import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Feature modules
import { UiModule } from '../ui.module';
import { ClipboardModule } from 'ngx-clipboard';

// Components
import { DebugFormComponent } from './debug-form/debug-form.component';
import { StackFilterComponent } from './stack-filter/stack-filter.component';
import { RedirectViewComponent } from './redirect-view/redirect-view.component';
import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { PopupComponent } from './pop-up/popup.component';
import { LazyJsonComponent } from './lazy-json/lazy-json.component';
import { StackTraceComponent } from './stack-trace/stack-trace.component';

// Directives
import { ScrollGlueDirective } from './scroll-glue/scroll-glue.directive';

const COMPONENTS = [
  DebugFormComponent,
  StackFilterComponent,
  RedirectViewComponent,
  ScrollGlueDirective,
  HeaderComponent,
  SidenavComponent,
  PopupComponent,
  LazyJsonComponent,
  StackTraceComponent,
];

@NgModule({
  imports: [CommonModule, FormsModule, UiModule, RouterModule, ClipboardModule],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class SharedModule {}
