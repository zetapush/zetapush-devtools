import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './api/guards/auth.guard';
import { CanDeactivateGuard } from './api/guards/canDeactivate-guard.service';
//
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'auth',
    loadChildren: './auth/auth.module#AuthModule',
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: './dashboard/dashboard.module#DashboardModule',
  },
  {
    path: 'sandboxes',
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard],
    loadChildren: './sandboxes/sandboxes.module#SandboxesModule',
  },
  {
    path: 'traces',
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard],
    loadChildren: './traces/traces.module#TracesModule',
  },
  {
    path: 'terminal',
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard],
    loadChildren: './terminal/terminal.module#TerminalModule',
  },
  {
    path: 'about',
    canDeactivate: [CanDeactivateGuard],
    loadChildren: './about/about.module#AboutModule',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), BrowserAnimationsModule],
  exports: [RouterModule],
  providers: [AuthGuard, CanDeactivateGuard],
})
export class AppRoutingModule {}
