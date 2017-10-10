import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSort } from '@angular/material';
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
      <button mat-raised-button (click)="onClearClick()">Clear</button>
    </nav>
    <mat-table #table [dataSource]="source" class="Table">
      <!-- Ctx Column -->
      <ng-container matColumnDef="ctx">
        <mat-header-cell *matHeaderCellDef> Ctx </mat-header-cell>
        <mat-cell *matCellDef="let row"> {{row.ctx}} </mat-cell>
      </ng-container>
      <!-- Ts Column -->
      <ng-container matColumnDef="ts">
        <mat-header-cell *matHeaderCellDef> Ts </mat-header-cell>
        <mat-cell *matCellDef="let row"> {{row.ts | date:'mediumTime'}} </mat-cell>
      </ng-container>
      <!-- Type Column -->
      <ng-container matColumnDef="type">
        <mat-header-cell *matHeaderCellDef> Type </mat-header-cell>
        <mat-cell *matCellDef="let row"> {{row.type}} </mat-cell>
      </ng-container>
      <!-- N Column -->
      <ng-container matColumnDef="n">
        <mat-header-cell *matHeaderCellDef> N </mat-header-cell>
        <mat-cell *matCellDef="let row"> {{row.n}} </mat-cell>
      </ng-container>
      <!-- Data Column -->
      <ng-container matColumnDef="data">
        <mat-header-cell *matHeaderCellDef> Data </mat-header-cell>
        <mat-cell *matCellDef="let row"> {{row.data}}</mat-cell>
      </ng-container>
      <!-- Line Column -->
      <ng-container matColumnDef="line">
        <mat-header-cell *matHeaderCellDef> Line </mat-header-cell>
        <mat-cell *matCellDef="let row"> {{row.line}} </mat-cell>
      </ng-container>
      <!-- Location Column -->
      <ng-container matColumnDef="location">
        <mat-header-cell *matHeaderCellDef> Recipe </mat-header-cell>
        <mat-cell *matCellDef="let row"> {{row.location.recipe}}@{{row.location.version}} </mat-cell>
      </ng-container>
      <!-- Owner Column -->
      <ng-container matColumnDef="owner">
        <mat-header-cell *matHeaderCellDef> Owner </mat-header-cell>
        <mat-cell *matCellDef="let row"> {{row.owner}} </mat-cell>
      </ng-container>
      <!-- Level Column -->
      <ng-container matColumnDef="level">
        <mat-header-cell *matHeaderCellDef> Level </mat-header-cell>
        <mat-cell *matCellDef="let row"> {{row.level}} </mat-cell>
      </ng-container>
      <mat-header-row *matHeaderRowDef="columns"></mat-header-row>
      <mat-row *matRowDef="let row; columns: columns;" (click)="onRowClick(row)" class="Table__Row"></mat-row>
    </mat-table>
    <zp-stack-trace *ngIf="selection" [traces]="selection"></zp-stack-trace>
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
