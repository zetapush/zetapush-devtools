import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  Trace,
  TraceCompletion,
  TraceLocation,
  parseTraceLocation,
} from './trace.interface';
/*
  ctx: number;
  type: TraceType;
  n: number;
  data: any;
  line: number;
  location: TraceLocation;
  owner: string;
  level: TraceLevel;
  ts: number;
*/
@Component({
  selector: 'zp-stack-trace',
  template: `
    <table>
      <thead>
        <tr>
          <th>N</th>
          <th>Type</th>
          <th>Date</th>
          <th>Location</th>
          <th>Owner</th>
          <th>Data</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let trace of traces" [ngClass]="['Trace', 'Trace--' + trace.type]">
          <td>{{trace.n}}</td>
          <td>{{trace.type}}</td>
          <td>{{trace.ts | date:'mediumTime'}}</td>
          <td>{{trace.location.recipe}}@{{trace.location.version}}</td>
          <td>{{trace.owner}}</td>
          <td>{{trace.data | json}}</td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [
    `
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
export class StackTraceComponent implements OnDestroy, OnInit {
  @Input() traces: Trace[] = [];

  constructor() {}

  ngOnInit() {}
  ngOnDestroy() {}
}
