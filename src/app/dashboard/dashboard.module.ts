import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Feature modules
import { UiModule } from '../ui.module';
import { SharedModule } from '../shared/shared.module';

// Routing
import { DashboardRoutingModule } from './dashboard-routing.module';

// Components
import { DashboardViewComponent } from './dashboard-view/dashboard-view.component';

@NgModule({
  imports: [CommonModule, DashboardRoutingModule, UiModule, SharedModule],
  declarations: [DashboardViewComponent],
  providers: [],
})
export class DashboardModule {}
