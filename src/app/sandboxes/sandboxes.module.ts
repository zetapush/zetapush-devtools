import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Feature modules
import { UiModule } from '../ui.module';
import { SharedModule } from '../shared/shared.module';

// Routing
import { SandboxesRoutingModule } from './sandboxes-routing.module';

// Components
import { SandboxesViewComponent } from './sandboxes-view/sandboxes-view.component';

@NgModule({
  imports: [CommonModule, SandboxesRoutingModule, UiModule, SharedModule],
  declarations: [SandboxesViewComponent],
  providers: [],
})
export class SandboxesModule {}
