import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Feature modules
import { UiModule } from '../ui.module';
import { SharedModule } from '../shared/shared.module';

// Routing
import { AboutRoutingModule } from './about-routing.module';

// Components
import { AboutViewComponent } from './about-view/about-view.component';
import { PopupComponent } from '../shared/pop-up/popup.component';

@NgModule({
  imports: [CommonModule, UiModule, SharedModule, AboutRoutingModule],
  declarations: [AboutViewComponent],
  bootstrap: [PopupComponent],
})
export class AboutModule {}
