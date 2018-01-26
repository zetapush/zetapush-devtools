import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IsAuthenticated } from './guards/is-authenticated';
import { SandboxStatusResolver } from './resolvers/sandbox-status-resolver.service';
import { SandboxesResolver } from './resolvers/sandboxes-resolver.service';
import { ServicesResolver } from './resolvers/services-resolver.service';
import { PreferencesStorage } from './services/preferences-storage.service';
import { DebugStatusApi } from './services/debug-status-api.service';

@NgModule({
  imports: [CommonModule],
  providers: [
    IsAuthenticated,
    SandboxStatusResolver,
    SandboxesResolver,
    ServicesResolver,
    PreferencesStorage,
    DebugStatusApi,
  ],
})
export class ApiModule {}
