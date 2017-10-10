import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MdSort } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { Authentication, Client, services } from 'zetapush-js';
import { Credentials } from './credentials.interface';
import {
  Trace,
  TraceCompletion,
  TraceLocation,
  parseTraceLocation,
} from './trace.interface';

import 'rxjs/add/observable/of';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

@Component({
  selector: 'zp-trace-view',
  template: `
    <h1>Trace for {{sandboxId}}</h1>
    <nav>
      <button md-raised-button (click)="onClearClick()">Clear</button>
    </nav>
    <md-table #table [dataSource]="source" class="Table">
      <!-- Ctx Column -->
      <ng-container mdColumnDef="ctx">
        <md-header-cell *mdHeaderCellDef> Ctx </md-header-cell>
        <md-cell *mdCellDef="let row"> {{row.ctx}} </md-cell>
      </ng-container>
      <!-- Ts Column -->
      <ng-container mdColumnDef="ts">
        <md-header-cell *mdHeaderCellDef> Ts </md-header-cell>
        <md-cell *mdCellDef="let row"> {{row.ts | date:'mediumTime'}} </md-cell>
      </ng-container>
      <!-- Type Column -->
      <ng-container mdColumnDef="type">
        <md-header-cell *mdHeaderCellDef> Type </md-header-cell>
        <md-cell *mdCellDef="let row"> {{row.type}} </md-cell>
      </ng-container>
      <!-- N Column -->
      <ng-container mdColumnDef="n">
        <md-header-cell *mdHeaderCellDef> N </md-header-cell>
        <md-cell *mdCellDef="let row"> {{row.n}} </md-cell>
      </ng-container>
      <!-- Data Column -->
      <ng-container mdColumnDef="data">
        <md-header-cell *mdHeaderCellDef> Data </md-header-cell>
        <md-cell *mdCellDef="let row"> {{row.data}}</md-cell>
      </ng-container>
      <!-- Line Column -->
      <ng-container mdColumnDef="line">
        <md-header-cell *mdHeaderCellDef> Line </md-header-cell>
        <md-cell *mdCellDef="let row"> {{row.line}} </md-cell>
      </ng-container>
      <!-- Location Column -->
      <ng-container mdColumnDef="location">
        <md-header-cell *mdHeaderCellDef> Recipe </md-header-cell>
        <md-cell *mdCellDef="let row"> {{row.location.recipe}}@{{row.location.version}} </md-cell>
      </ng-container>
      <!-- Owner Column -->
      <ng-container mdColumnDef="owner">
        <md-header-cell *mdHeaderCellDef> Owner </md-header-cell>
        <md-cell *mdCellDef="let row"> {{row.owner}} </md-cell>
      </ng-container>
      <!-- Level Column -->
      <ng-container mdColumnDef="level">
        <md-header-cell *mdHeaderCellDef> Level </md-header-cell>
        <md-cell *mdCellDef="let row"> {{row.level}} </md-cell>
      </ng-container>
      <md-header-row *mdHeaderRowDef="columns"></md-header-row>
      <md-row *mdRowDef="let row; columns: columns;" (click)="onRowClick(row)" class="Table__Row"></md-row>
    </md-table>
    <ul *ngIf="selection">
      <li [ngClass]="['Trace', 'Trace--' + trace.type]" *ngFor="let trace of selection">{{trace | json}}</li>
    <ul>
  `,
  styles: [
    `
    .Table {
      height: 50vh;
      border: 1px dashed rgba(0,0,0,.12);
      overflow-y: scroll;
    }
    .Table__Body {
    }
    .Table__Row {
      cursor: pointer;
    }
    .Trace {}
    .Trace--USR {
      color: #1B6FCB;
      font-weight: bold;
    }
    .Trace--CMT {
      color: #C1B8B6;
    }
    .Trace--MS,
    .Trace--ME {
      color: #919191;
      font-weight: bold;
    }
  `,
  ],
})
export class TraceViewComponent implements OnDestroy, OnInit {
  sandboxId: string;
  traces: any[] = [];
  map = new Map<number, Trace[]>();
  client: Client;
  connected = false;
  subject = new BehaviorSubject<Trace[]>([]);
  source: TraceDataSource | null;
  columns = ['ctx', 'ts', 'type', 'n', 'data', 'line', 'location', 'owner'];
  selection: Trace[];

  constructor(private route: ActivatedRoute) {
    route.params.subscribe(({ sandboxId }) => {
      console.log('TraceViewComponent', sandboxId);
      this.sandboxId = sandboxId;
    });
  }

  createTraceObservable(
    client: Client,
    dictionnary: Map<number, Trace[]>,
    deploymentId = services.Macro.DEFAULT_DEPLOYMENT_ID,
  ): Observable<Trace[]> {
    return new Observable(observer => {
      const api = client.createService({
        Type: services.Macro,
        deploymentId,
        listener: {
          trace: (message: TraceCompletion) => {
            const trace = {
              ...message.data,
              location: parseTraceLocation(message.data.location),
              ts: Date.now(),
            };
            try {
              const { level, ...infos } = trace;
              const queue = dictionnary.has(trace.ctx)
                ? dictionnary.get(trace.ctx)
                : [];
              queue[trace.n] = trace;
              dictionnary.set(trace.ctx, queue);
            } catch (e) {
              // console.log(trace);
            }
            const traces = Array.from(
              dictionnary.entries(),
            ).map(([ctx, list]) => {
              return list[1];
            });
            observer.next(traces);
          },
        },
      });
      return () => {
        client.unsubscribe(api);
      };
    });
  }

  ngOnInit() {
    this.source = new TraceDataSource(this.subject /*, this.sort*/);
    const credentials = JSON.parse(
      sessionStorage.getItem('zp:devtools:credentials'),
    ) as Credentials;
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
      console.log('onSuccessfulHandshake', authentication);
      this.connected = true;
    });
    this.client.connect();
    this.createTraceObservable(
      this.client,
      this.map,
      'macro_0',
    ).subscribe(traces => this.subject.next(traces));
    this.createTraceObservable(
      this.client,
      this.map,
      'macro_1',
    ).subscribe(traces => this.subject.next(traces));
  }
  ngOnDestroy() {
    this.client.disconnect();
  }
  onClearClick() {
    this.map = new Map<number, Trace[]>();
    this.traces = [];
    this.subject.next(this.traces);
    this.selection = null;
  }
  onRowClick(trace: Trace) {
    console.log('TraceViewComponent::onRowClick', trace);
    const traces = this.map.get(trace.ctx).filter(truthy => truthy);
    console.log('TraceViewComponent::onRowClick', traces);
    this.selection = traces;
  }
}

export class TraceDataSource extends DataSource<Trace> {
  constructor(private _subject: BehaviorSubject<Trace[]>) {
    super();
    console.warn('TraceDataSource::constructor', _subject);
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Trace[]> {
    const changes = [this._subject];
    return Observable.merge(...changes);
  }

  disconnect() {}
}
