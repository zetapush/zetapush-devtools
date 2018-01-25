import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';

import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

import { AppRoutingModule } from './app-routing.module';
import { UiModule } from './ui.module';
import { EnvModule, environment } from './env.module';
import { SharedModule } from './shared/shared.module';
import { ApiModule } from './api/api.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    // Environement module
    EnvModule,
    // Provide Core Services
    AppRoutingModule,
    UiModule,
    ApiModule,
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
    // Shared
    SharedModule,
  ],
  providers: [{ provide: LocationStrategy, useClass: PathLocationStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
