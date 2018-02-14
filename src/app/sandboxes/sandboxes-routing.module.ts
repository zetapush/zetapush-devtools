import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../api/guards/auth.guard';
import { SandboxesResolver } from '../api/resolvers/sandboxes-resolver.service';

import { SandboxesViewComponent } from './sandboxes-view/sandboxes-view.component';

const ROUTES: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: SandboxesViewComponent,
    resolve: {
      sandboxes: SandboxesResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
  providers: [AuthGuard, SandboxesResolver],
})
export class SandboxesRoutingModule {}
