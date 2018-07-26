import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../api/guards/auth.guard';
import { ServicesResolver } from '../api/resolvers/services-resolver.service';
import { SandboxStatusResolver } from '../api/resolvers/sandbox-status-resolver.service';

import { ErrorViewComponent } from './error-view/error-view.component';

const ROUTES: Routes = [
  {
    path: ':sandboxId',
    canActivate: [AuthGuard],
    component: ErrorViewComponent,
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
export class ErrorRoutingModule {}
