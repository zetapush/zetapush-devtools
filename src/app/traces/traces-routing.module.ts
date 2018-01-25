import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IsAuthenticated } from '../api/guards/is-authenticated';
import { ServicesResolver } from '../api/resolvers/services-resolver.service';
import { SandboxStatusResolver } from '../api/resolvers/sandbox-status-resolver.service';

import { TracesViewComponent } from './traces-view/traces-view.component';

const ROUTES: Routes = [
  {
    path: ':sandboxId',
    canActivate: [IsAuthenticated],
    component: TracesViewComponent,
    resolve: {
      status: SandboxStatusResolver,
      services: ServicesResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
  providers: [IsAuthenticated, SandboxStatusResolver, ServicesResolver],
})
export class TracesRoutingModule {}
