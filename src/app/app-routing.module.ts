import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router';

import { IsAuthenticated } from './api/guards/is-authenticated';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'sandboxes',
  },
  {
    path: 'auth',
    loadChildren: './auth/auth.module#AuthModule',
  },
  {
    path: 'sandboxes',
    canActivate: [IsAuthenticated],
    loadChildren: './sandboxes/sandboxes.module#SandboxesModule',
  },
  {
    path: 'traces',
    canActivate: [IsAuthenticated],
    loadChildren: './traces/traces.module#TracesModule',
  },
  {
    path: 'terminal',
    canActivate: [IsAuthenticated],
    loadChildren: './terminal/terminal.module#TerminalModule',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), BrowserAnimationsModule],
  exports: [RouterModule],
  providers: [IsAuthenticated],
})
export class AppRoutingModule {}
