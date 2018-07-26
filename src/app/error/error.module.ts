import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Routing
import { ErrorRoutingModule } from './error-routing.module';

// Component
import { ErrorViewComponent } from './error-view/error-view.component';

// Feature modules
import { UiModule } from '../ui.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [CommonModule, ErrorRoutingModule, UiModule, SharedModule],
  declarations: [ErrorViewComponent],
})
export class ErrorModule {}
