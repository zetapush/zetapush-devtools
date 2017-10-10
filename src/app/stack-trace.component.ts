import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  Trace,
  TraceCompletion,
  TraceLocation,
  parseTraceLocation,
} from './trace.interface';

@Component({
  selector: 'zp-stack-trace',
  template: `
    <ul>
      <li [ngClass]="['Trace', 'Trace--' + trace.type]" *ngFor="let trace of traces">{{trace | json}}</li>
    <ul>
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
