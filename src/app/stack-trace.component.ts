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
    <form class="Form Form--Filter">
      <span>Filter: </span>
      <mat-checkbox *ngFor="let type of types" [(ngModel)]="type.selected" name="filter" class="Filter">{{type.label}}</mat-checkbox>
    </form>
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
          </td>
          <td>{{trace.owner}}</td>
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
    .Form--Filter {
      font-weight: bold;
    }
    .Filter {
      padding-right: 0.25rem;
    }
  `,
  ],
})
export class StackTraceComponent implements OnDestroy, OnInit {
  @Input() traces: Trace[] = [];
  types = [
    { label: 'MS', selected: true },
    { label: 'ME', selected: true },
    { label: 'CMT', selected: false },
    { label: 'USR', selected: true },
  ];
  constructor() {}
  get filtered() {
    const types = this.types
      .filter(type => type.selected)
      .map(type => type.label);
    return this.traces
      ? this.traces.filter(trace => types.includes(trace.type))
      : [];
  }
  ngOnInit() {}
  ngOnDestroy() {}
}
