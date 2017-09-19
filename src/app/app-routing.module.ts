import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router';

import { IsAuthenticated } from './is-authenticated';
import { SandboxesResolver } from './sandboxes-resolver.service';

import { LoginViewComponent } from './login-view.component';
import { SandboxesViewComponent } from './sandboxes-view.component';
import { TraceViewComponent } from './trace-view.component';
import { RedirectViewComponent } from './redirect-view.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginViewComponent,
  },
  {
    path: 'sandboxes',
    canActivate: [IsAuthenticated],
    component: SandboxesViewComponent,
    resolve: {
      sandboxes: SandboxesResolver,
    },
  },
  {
    path: 'trace/:sandboxId',
    canActivate: [IsAuthenticated],
    component: TraceViewComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/sandboxes',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), BrowserAnimationsModule],
  exports: [RouterModule],
  providers: [IsAuthenticated, SandboxesResolver],
})
export class AppRoutingModule {}
