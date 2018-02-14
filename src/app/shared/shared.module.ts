import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Feature modules
import { UiModule } from '../ui.module';

// Components
import { DebugFormComponent } from './debug-form/debug-form.component';
import { StackFilterComponent } from './stack-filter/stack-filter.component';
import { RedirectViewComponent } from './redirect-view/redirect-view.component';
import { HeaderComponent } from './header/header.component';

// Directives
import { ScrollGlueDirective } from './scroll-glue/scroll-glue.directive';

const COMPONENTS = [
  DebugFormComponent,
  StackFilterComponent,
  RedirectViewComponent,
  ScrollGlueDirective,
  HeaderComponent,
];

@NgModule({
  imports: [CommonModule, FormsModule, UiModule],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
})
export class SharedModule {}
