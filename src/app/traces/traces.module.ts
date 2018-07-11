import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Feature modules
import { UiModule } from '../ui.module';
import { SharedModule } from '../shared/shared.module';
import { MatTreeModule } from '@angular/material/tree';
import { ClipboardModule } from 'ngx-clipboard';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Routing
import { TracesRoutingModule } from './traces-routing.module';

// Components
import { TracesViewComponent } from './traces-view/traces-view.component';
import { StackTraceComponent } from './stack-trace/stack-trace.component';
import { LazyJsonComponent } from './lazy-json/lazy-json.component';
import { StackListComponent } from './stack-list/stack-list.component';
import { StackTreeComponent } from './stack-tree/stack-tree.component';

@NgModule({
  imports: [
    CommonModule,
    TracesRoutingModule,
    UiModule,
    SharedModule,
    MatTreeModule,
    ClipboardModule,
    MatSnackBarModule,
  ],
  declarations: [
    TracesViewComponent,
    StackTraceComponent,
    LazyJsonComponent,
    StackListComponent,
    StackTreeComponent,
  ],
  providers: [],
})
export class TracesModule {}
