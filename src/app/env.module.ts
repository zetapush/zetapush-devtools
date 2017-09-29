import { InjectionToken, NgModule } from '@angular/core';
import { Environement, Platform } from './environment.interface';
import { environment } from '../environments/environment';

export const ENVIRONMENT_ID = new InjectionToken<Environement>('Environment');

@NgModule({
  providers: [{ provide: ENVIRONMENT_ID, useValue: environment }],
})
export class EnvModule {}
