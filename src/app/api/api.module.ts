import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthGuard } from './guards/auth.guard';
import { CanLeaveViewGuard } from './guards/canleaveview.guard';
import { SandboxStatusResolver } from './resolvers/sandbox-status-resolver.service';
import { SandboxesResolver } from './resolvers/sandboxes-resolver.service';
import { ServicesResolver } from './resolvers/services-resolver.service';
import { PreferencesStorage } from './services/preferences-storage.service';
import { DebugStatusApi } from './services/debug-status-api.service';
import { AuthService } from './services/auth.service';
import { SandboxService } from './services/sandbox.service';
import { VersionService } from './services/version.service';

@NgModule({
  imports: [CommonModule],
  providers: [
    AuthGuard,
    CanLeaveViewGuard,
    SandboxStatusResolver,
    SandboxesResolver,
    ServicesResolver,
    PreferencesStorage,
    DebugStatusApi,
    AuthService,
    SandboxService,
    VersionService,
  ],
})
export class ApiModule {}
