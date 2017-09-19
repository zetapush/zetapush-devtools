import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Authentication, Client, services } from 'zetapush-js';
import { Credentials } from './credentials.interface';

@Component({
  selector: 'zp-trace-view',
  template: `
    <h1>Trace for {{sandboxId}}</h1>
    <ul *ngFor="let trace of traces">
      <li>{{trace | json}}</li>
    </ul>
  `,
  styles: [],
})
export class TraceViewComponent implements OnInit {
  sandboxId: string;
  traces: any[] = [];

  constructor(private route: ActivatedRoute) {
    route.params.subscribe(({ sandboxId } = {}) => {
      console.log('TraceViewComponent', sandboxId);
      this.sandboxId = sandboxId;
    });
  }

  ngOnInit() {
    const credentials = JSON.parse(
      sessionStorage.getItem('zp:devtools:credentials'),
    ) as Credentials;
    const client = new Client({
      apiUrl: `${credentials.apiUrl}/zbo/pub/business/`,
      sandboxId: this.sandboxId,
      authentication: () =>
        Authentication.create({
          authType: 'developer',
          deploymentId: 'developer',
          login: credentials.username,
          password: credentials.password,
        }),
    });
    const api = client.createService({
      Type: services.Macro,
      listener: {
        trace: message => {
          const trace = message.data;
          try {
            const { level, ...infos } = trace;
            console[level.toLowerCase()](infos);
          } catch (e) {
            console.log(trace);
          }
          this.traces.push(trace);
        },
      },
    });
    client.onSuccessfulHandshake(authentication => {
      console.log('onSuccessfulHandshake', authentication);
    });
    client.connect();
  }
}
