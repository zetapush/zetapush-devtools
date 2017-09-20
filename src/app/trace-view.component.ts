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

import 'rxjs/add/observable/of';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

export interface Trace {
  n: number;
  data: any;
  line: number;
  location: string;
  owner: string;
  level: string;
}

@Component({
  selector: 'zp-trace-view',
  template: `
    <h1>Trace for {{sandboxId}}</h1>
    <md-table #table [dataSource]="source">
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
        <md-header-cell *mdHeaderCellDef> Location </md-header-cell>
        <md-cell *mdCellDef="let row"> {{row.location}} </md-cell>
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
      <md-row *mdRowDef="let row; columns: columns;"></md-row>
    </md-table>
  `,
  styles: [],
})
export class TraceViewComponent implements OnDestroy, OnInit {
  sandboxId: string;
  traces: any[] = [];
  client: Client;
  connected = false;
  subject = new BehaviorSubject<Trace[]>([]);
  source: TraceDataSource | null;
  columns = ['n', 'data', 'line', 'location', 'owner', 'level'];

  constructor(private route: ActivatedRoute) {
    route.params.subscribe(({ sandboxId }) => {
      console.log('TraceViewComponent', sandboxId);
      this.sandboxId = sandboxId;
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
    const api = this.client.createService({
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
          this.traces = [trace, ...this.traces];
          this.subject.next(this.traces);
        },
      },
    });
    this.client.onSuccessfulHandshake(authentication => {
      console.log('onSuccessfulHandshake', authentication);
      this.connected = true;
    });
    this.client.connect();
  }
  ngOnDestroy() {
    this.client.disconnect();
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
