import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Feature modules
import { UiModule } from '../ui.module';
import { SharedModule } from '../shared/shared.module';
import { MatTreeModule } from '@angular/material/tree';

// Routing
import { TracesRoutingModule } from './traces-routing.module';

// Components
import { TracesViewComponent } from './traces-view/traces-view.component';
import { StackTraceComponent } from './stack-trace/stack-trace.component';
import { LazyJsonComponent } from './lazy-json/lazy-json.component';

@NgModule({
  imports: [
    CommonModule,
    TracesRoutingModule,
    UiModule,
    SharedModule,
    MatTreeModule,
  ],
  declarations: [TracesViewComponent, StackTraceComponent, LazyJsonComponent],
  providers: [],
})
export class TracesModule {}
