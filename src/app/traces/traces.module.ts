import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Feature modules
import { UiModule } from '../ui.module';
import { SharedModule } from '../shared/shared.module';

// Routing
import { TracesRoutingModule } from './traces-routing.module';

// Components
import { TracesViewComponent } from './traces-view/traces-view.component';

@NgModule({
  imports: [CommonModule, TracesRoutingModule, UiModule, SharedModule],
  declarations: [TracesViewComponent],
  providers: [],
})
export class TracesModule {}
