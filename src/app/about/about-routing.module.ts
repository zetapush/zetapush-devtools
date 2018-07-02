import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutViewComponent } from './about-view/about-view.component';

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
