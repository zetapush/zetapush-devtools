import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';

import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

import { AppRoutingModule } from './app-routing.module';
import { UiModule } from './ui.module';
import { EnvModule, environment } from './env.module';

import { AppComponent } from './app.component';
import { LoginViewComponent } from './login-view.component';
import { SandboxesViewComponent } from './sandboxes-view.component';
import { StackTraceComponent } from './stack-trace.component';
import { RedirectViewComponent } from './redirect-view.component';
import { TraceViewComponent } from './trace-view.component';
import { TerminalViewComponent } from './terminal-view.component';
import { DebugFormComponent } from './debug-form.component';
import { DebugStatusApi } from './debug-status-api.service';
import { PreferencesStorage } from './preferences-storage.service';
import { LazyJsonComponent } from './lazy-json.component';

import { ScrollGlueDirective } from './scrollGlue.directive';

@NgModule({
  declarations: [
    AppComponent,
    LoginViewComponent,
    SandboxesViewComponent,
    StackTraceComponent,
    TraceViewComponent,
    TerminalViewComponent,
    RedirectViewComponent,
    DebugFormComponent,
    LazyJsonComponent,
    ScrollGlueDirective,
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
    Angulartics2Module.forRoot([Angulartics2GoogleTagManager]),
    // Service worker
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production,
    }),
    // Logger
    LoggerModule.forRoot({
      level: NgxLoggerLevel.LOG,
      serverLogLevel: NgxLoggerLevel.OFF,
    }),
  ],
  providers: [
    DebugStatusApi,
    PreferencesStorage,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
