import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutViewComponent } from './about-view/about-view.component';
import { CanDeactivateGuard } from '../shared/guard/canDeactivate-guard.service';

const ROUTES: Routes = [
  {
    path: '',
    component: AboutViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
  providers: [],
})
export class AboutRoutingModule {}
