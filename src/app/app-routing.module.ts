import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './api/guards/auth.guard';

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
  // {
  //   path: 'sandboxes',
  //   canActivate: [AuthGuard],
  //   loadChildren: './sandboxes/sandboxes.module#SandboxesModule',
  // },
  {
    path: 'traces',
    canActivate: [AuthGuard],
    loadChildren: './traces/traces.module#TracesModule',
  },
  {
    path: 'terminal',
    canActivate: [AuthGuard],
    loadChildren: './terminal/terminal.module#TerminalModule',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), BrowserAnimationsModule],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
