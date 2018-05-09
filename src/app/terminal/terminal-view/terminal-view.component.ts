import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Authentication, Client, services as SERVICES } from 'zetapush-js';
import { NGXLogger } from 'ngx-logger';
import { Observable, BehaviorSubject } from 'rxjs';

import JSONFormatter from 'json-formatter-js';

import { Sandbox } from '../../api/interfaces/sandbox.interface';
import { PreferencesStorage } from '../../api/services/preferences-storage.service';
import {
  Trace,
  TraceCompletion,
  TerminalTraces,
  parseTraceLocation,
} from '../../api/interfaces/trace.interface';
import { ViewTypeFilter } from '../../api/interfaces/type-filter.interface';
import { ScrollGlueDirective } from '../../shared/scroll-glue/scroll-glue.directive';

@Component({
  selector: 'zp-terminal',
  styleUrls: ['terminal-view.component.scss'],
  templateUrl: 'terminal-view.component.html',
})
export class TerminalViewComponent implements OnInit, OnDestroy {
  sandboxId: string;
  services: string[] = [];
  traces: any[] = [];
  client: Client;
  subject = new BehaviorSubject<TerminalTraces>({
    traces: [],
    collapseToggle: true,
  });
  connected = false;
  buffer = 1000;
  collapsed = true;
  collapseToggle = true;
  types: ViewTypeFilter[] = [
    { label: 'MS', selected: false },
    { label: 'ME', selected: false },
    { label: 'CMT', selected: false },
    { label: 'USR', selected: true },
  ];

  @ViewChild(ScrollGlueDirective) messageListRef: ScrollGlueDirective;

  constructor(
    private route: ActivatedRoute,
    private preferences: PreferencesStorage,
    private logger: NGXLogger,
  ) {}

  ngOnInit() {
    this.route.params.subscribe(({ sandboxId }) => {
      this.logger.log('TraceViewComponent::route.params', sandboxId);
      this.sandboxId = sandboxId;
    });
    this.route.data.subscribe(({ services, status }) => {
      this.logger.log('TraceViewComponent::route.data', services, status);
      this.services = services;
    });

    this.connectToSanboxe();
  }

  ngOnDestroy() {
    this.client.disconnect();
  }

  onClearClick() {
    this.logger.log('TerminalViewComponent::onClearClick');
    this.traces = [];
    this.subject.next({
      traces: this.traces,
      collapseToggle: this.collapseToggle,
    });
  }

  createTraceObservable(
    client: Client,
    deploymentId = SERVICES.Macro.DEFAULT_DEPLOYMENT_ID,
  ): Observable<TerminalTraces> {
    return new Observable(observer => {
      const api = client.createService({
        Type: SERVICES.Macro,
        deploymentId,
        listener: {
          trace: (message: TraceCompletion) => {
            const trace = {
              ...message.data,
              location: parseTraceLocation(message.data.location),
              ts: Date.now(),
            };

            this.traces = [...this.traces, trace];

            // Remove the 100 first entries if traces > buffer
            // TODO: Improve
            if (this.traces.length > this.buffer) {
              this.traces = this.traces.slice(100);
            }

            observer.next({
              traces: this.traces,
              collapseToggle: this.collapseToggle,
            });
          },
        },
      });
      return () => {
        client.unsubscribe(api);
      };
    });
  }

  connectToSanboxe() {
    const credentials = this.preferences.getCredentials();

    this.client = new Client({
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
    this.client.onSuccessfulHandshake(authentication => {
      this.logger.log('onSuccessfulHandshake', authentication);
      this.connected = true;
    });
    this.client.connect();

    // Enable subscription for all deployed services
    this.services.forEach(deploymentId =>
      this.createTraceObservable(this.client, deploymentId).subscribe(traces =>
        this.subject.next(traces),
      ),
    );
  }

  filterTraces(filteredTraces: Trace[]) {
    this.subject.next({
      traces: filteredTraces,
      collapseToggle: this.collapseToggle,
    });
  }

  onChangeCollapseOutput(event) {
    this.logger.log('TraceViewComponent::onChangeCollapseOutput');
    this.collapsed = event.checked;
  }

  onClickCollapseAll() {
    this.logger.log('TraceViewComponent::onClickCollapseAll');
    const terminalTraces = { ...this.subject.getValue() };
    this.collapseToggle = !this.collapseToggle;
    terminalTraces.collapseToggle = this.collapseToggle;

    this.subject.next(terminalTraces);
  }
}
