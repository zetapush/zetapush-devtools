import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Feature modules
import { UiModule } from '../ui.module';
import { SharedModule } from '../shared/shared.module';

// Routing
import { TerminalRoutingModule } from './terminal-routing.module';

// Components
import { TerminalViewComponent } from './terminal-view/terminal-view.component';
import { JsonViewerComponent } from './json-viewer/json-viewer.component';

@NgModule({
  imports: [CommonModule, TerminalRoutingModule, UiModule, SharedModule],
  declarations: [TerminalViewComponent, JsonViewerComponent],
  providers: [],
})
export class TerminalModule {}
