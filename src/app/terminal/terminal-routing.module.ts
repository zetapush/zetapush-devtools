import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../api/guards/auth.guard';
import { ServicesResolver } from '../api/resolvers/services-resolver.service';
import { SandboxStatusResolver } from '../api/resolvers/sandbox-status-resolver.service';

import { TerminalViewComponent } from './terminal-view/terminal-view.component';

const ROUTES: Routes = [
  {
    path: ':sandboxId',
    canActivate: [AuthGuard],
    component: TerminalViewComponent,
    resolve: {
      status: SandboxStatusResolver,
      services: ServicesResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
  providers: [AuthGuard, SandboxStatusResolver, ServicesResolver],
})
export class TerminalRoutingModule {}
