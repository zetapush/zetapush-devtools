import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';
import {
  Trace,
  TraceCompletion,
  TraceLocation,
  parseTraceLocation,
} from '../../api/interfaces/trace.interface';
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

interface ViewTypeFilter {
  label: string;
  selected: boolean;
}

@Component({
  selector: 'zp-stack-trace',
  template: `
    <zp-stack-filter [traces]="traces" (filteredTraces)="filterTraces($event)"></zp-stack-filter>
    <table>
      <thead>
        <tr>
          <th>N</th>
          <th>Type</th>
          <th>Content</th>
          <th>Owner</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let trace of filtered" [ngClass]="['Trace', 'Trace--' + trace.type]">
          <td>{{trace.n}}</td>
          <td>{{trace.type}}</td>
          <td>
            <zp-lazy-json *ngIf="trace.type == 'MS'" [value]="trace.data" [placeholder]="trace.data.name"></zp-lazy-json>
            <zp-lazy-json *ngIf="trace.type == 'ME'" [value]="trace.data" [placeholder]="trace.data.name"></zp-lazy-json>
            <zp-lazy-json *ngIf="trace.type == 'USR'" [value]="trace.data"></zp-lazy-json>
            <pre *ngIf="trace.type == 'CMT'">{{trace.data}}</pre>
          </td>
          <td>{{trace.owner}}</td>
        </tr>
      </tbody>
    </table>
  `,
  styleUrls: [],
})
export class StackTraceComponent {
  filtered: Trace[] = [];

  @Input() traces: Trace[] = [];

  filterTraces(filteredTraces: Trace[]) {
    this.filtered = filteredTraces;
  }
}
