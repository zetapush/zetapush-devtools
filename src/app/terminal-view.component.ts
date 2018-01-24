import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Authentication, Client, services as SERVICES } from 'zetapush-js';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import JSONFormatter from 'json-formatter-js';

import { DebugStatusView } from './debug-form.component';
import { Sandbox } from './sandboxes-resolver.service';
import { PreferencesStorage } from './preferences-storage.service';
import { DebugStatus, DebugStatusApi } from './debug-status-api.service';
import { Trace, TraceCompletion, parseTraceLocation } from './trace.interface';
import { ScrollGlueDirective } from './scrollGlue.directive';

@Component({
  selector: 'zp-terminal',
  styles: [
    `
    .back-link {
      cursor: pointer;
    }
    zp-stack-filter {
      float: left;
    }
    .collapsed {
      margin-top: 10px;
      padding-left: 0.5rem;
    }
    .collapse-toggle {
      float: right;
      padding-right: 0.5rem;
    }
    .collapse-button {
      margin-left: 15px;
    }
    .clear {
      float: right;
      clear: both;
    }
    .terminal {
      max-width: 800px;
      height: 600px;
      padding: 10px;
      margin: 20px auto;
      color: white;
      background-color: rgb(30, 30, 30);
      overflow-y: scroll;
      clear: both;
    }
    .terminal-title {
      font-family: 'monospace';
      font-size: 14px;
      color: orange;
    }
    .terminal-content {
      margin: 5px 0 10px 0;
      display: block;
    }
    :host ::ng-deep .json-formatter-dark.json-formatter-row .json-formatter-string {
      white-space: pre-wrap;
    }
  `,
  ],
  template: `
    <div class="terminal-container">
      <h1>
        <mat-icon class="back-link" mat-list-icon [routerLink]="['/sandboxes']">arrow_back</mat-icon>
        <span>Terminal for {{ sandboxId }}</span>
      </h1>
      <zp-debug-form [sandboxId]="sandboxId" [services]="services"></zp-debug-form>
      <zp-stack-filter [traces]="traces" (filteredTraces)="filterTraces($event)"></zp-stack-filter>

      <div class="collapse-toggle">
        <mat-slide-toggle
            class="collapsed"
            [color]="'accent'"
            [checked]="collapsed"
            labelPosition="before"
            (change)="onChangeCollapseOutput($event)">
          Collapsed output
        </mat-slide-toggle>

        <button mat-raised-button
          color="accent"
          class="collapse-all"
          [disabled]="!subject.getValue().length"
          (click)="onClickCollapseAll()">
          <mat-icon>import_export</mat-icon> {{ collapseToggle  ? 'Expand all' : 'Collapse all' }}
        </button>
      </div>

      <button mat-icon-button class="clear">
        <mat-icon aria-label="Clear terminal" (click)="onClearClick()">clear</mat-icon>
      </button>

      <div class="terminal" *ngIf="subject.getValue().length; else watching" zpScrollGlue>
        <div *ngFor="let output of subject.getValue()">
          <div class="terminal-title">
            <span class="owner">{{ output.owner }}</span>
            <span class="separator">-</span>
            <span class="time">{{ output.ts | date:'yyyy-MM-dd HH:mm:ss' }}</span>
          </div>
          <zp-json-viewer class="terminal-content"
            [json]="output.data"
            [collapsed]="collapsed"
            [collapsedTrace]="collapsedTrace">
          </zp-json-viewer>
        </div>
      </div>

      <ng-template #watching>
        <div class="terminal">Waiting for user traces ...</div>
      </ng-template>
    </div>
  `,
})
export class TerminalViewComponent implements OnInit, OnDestroy {
  sandboxId: string;
  services: string[] = [];
  traces: any[] = [];
  client: Client;
  subject = new BehaviorSubject<Trace[]>([]);
  connected = false;
  buffer = 1000;
  collapsed = true;
  collapsedTrace = {
    toggle: true,
    trace: null,
  };
  collapseToggle = true;

  @Input() sandboxes: Sandbox[];

  @ViewChild(ScrollGlueDirective) messageListRef: ScrollGlueDirective;

  constructor(
    private route: ActivatedRoute,
    private preferences: PreferencesStorage,
    private debug: DebugStatusApi,
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
    this.subject.next(this.traces);
  }

  createTraceObservable(
    client: Client,
    deploymentId = SERVICES.Macro.DEFAULT_DEPLOYMENT_ID,
  ): Observable<Trace[]> {
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

            observer.next(this.traces);
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
    this.subject.next(filteredTraces);
  }

  onChangeCollapseOutput(event) {
    this.logger.log('TraceViewComponent::onChangeCollapseOutput');
    this.collapsed = event.checked;
  }

  onClickCollapseAll() {
    this.logger.log('TraceViewComponent::onClickCollapseAll');
    this.collapseToggle = !this.collapseToggle;

    this.subject.getValue().map(trace => {
      this.collapsedTrace = {
        toggle: this.collapseToggle,
        trace: trace,
      };
    });
  }
}
