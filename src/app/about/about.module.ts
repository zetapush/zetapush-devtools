import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Feature modules
import { UiModule } from '../ui.module';
import { SharedModule } from '../shared/shared.module';
import {
  MatTreeModule,
  MatIconModule,
  MatButtonModule,
} from '@angular/material';

// Routing
import { AboutRoutingModule } from './about-routing.module';

// Components
import { AboutViewComponent } from './about-view/about-view.component';
import { PopupComponent } from '../shared/pop-up/popup.component';
import { AboutTreeComponent } from './about-view/about-tree.component';

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    SharedModule,
    AboutRoutingModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
  ],
  declarations: [AboutViewComponent, AboutTreeComponent],
  bootstrap: [PopupComponent],
})
export class AboutModule {}
