import { InjectionToken, NgModule } from '@angular/core';
import { environment } from '../environments/environment';

export interface Environement {
  production: boolean;
  zetapush: {
    apiUrl: string;
    sandboxId: string;
  };
}

export const ENVIRONMENT_ID = new InjectionToken<Environement>('Environment');

@NgModule({
  providers: [{ provide: ENVIRONMENT_ID, useValue: environment }],
})
export class EnvModule {}
