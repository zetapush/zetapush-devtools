import { BrowserModule } from '@angular/platform-browser';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { UiModule } from './ui.module';
import { EnvModule } from './env.module';

import { AppComponent } from './app.component';
import { LoginViewComponent } from './login-view.component';
import { SandboxesViewComponent } from './sandboxes-view.component';
import { TraceViewComponent } from './trace-view.component';
import { RedirectViewComponent } from './redirect-view.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginViewComponent,
    SandboxesViewComponent,
    TraceViewComponent,
    RedirectViewComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    // Environement module
    EnvModule,
    // Provide Core Services
    AppRoutingModule,
    UiModule,
  ],
  providers: [{ provide: LocationStrategy, useClass: PathLocationStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
