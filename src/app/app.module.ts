import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Angulartics2Module, Angulartics2GoogleTagManager } from 'angulartics2';

import { AppRoutingModule } from './app-routing.module';
import { UiModule } from './ui.module';
import { EnvModule } from './env.module';

import { AppComponent } from './app.component';
import { LoginViewComponent } from './login-view.component';
import { SandboxesViewComponent } from './sandboxes-view.component';
import { StackTraceComponent } from './stack-trace.component';
import { RedirectViewComponent } from './redirect-view.component';
import { TraceViewComponent } from './trace-view.component';
import { DebugFormComponent } from './debug-form.component';
import { DebugStatusApi } from './debug-status-api.service';
import { PreferencesStorage } from './preferences-storage.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginViewComponent,
    SandboxesViewComponent,
    StackTraceComponent,
    TraceViewComponent,
    RedirectViewComponent,
    DebugFormComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    // Environement module
    EnvModule,
    // Provide Core Services
    AppRoutingModule,
    UiModule,
    // Analytics
    Angulartics2Module.forRoot([Angulartics2GoogleTagManager])
  ],
  providers: [
    DebugStatusApi,
    PreferencesStorage,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
