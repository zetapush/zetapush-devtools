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
import { EnvModule } from './env.module';
import { SharedModule } from './shared/shared.module';
import { ApiModule } from './api/api.module';

import { PopupComponent } from './shared/pop-up/popup.component';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

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
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],
  providers: [{ provide: LocationStrategy, useClass: PathLocationStrategy }],
  bootstrap: [AppComponent],
  entryComponents: [PopupComponent],
})
export class AppModule {}
