import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IsAuthenticated } from '../api/guards/is-authenticated';
import { SandboxesResolver } from '../api/resolvers/sandboxes-resolver.service';

import { SandboxesViewComponent } from './sandboxes-view/sandboxes-view.component';

const ROUTES: Routes = [
  {
    path: '',
    canActivate: [IsAuthenticated],
    component: SandboxesViewComponent,
    resolve: {
      sandboxes: SandboxesResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
  providers: [IsAuthenticated, SandboxesResolver],
})
export class SandboxesRoutingModule {}
