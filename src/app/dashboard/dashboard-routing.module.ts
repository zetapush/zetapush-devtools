import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../api/guards/auth.guard';

import { DashboardViewComponent } from './dashboard-view/dashboard-view.component';

const ROUTES: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: DashboardViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class DashboardRoutingModule {}
