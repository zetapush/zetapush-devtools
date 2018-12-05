import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';
import {
  Trace,
  TraceCompletion,
  TraceLocation,
  parseTraceLocation,
} from '../../api/interfaces/trace.interface';
import { ViewTypeFilter } from '../../api/interfaces/type-filter.interface';

@Component({
  selector: 'zp-stack-trace',
  template: `
    <zp-stack-filter
      [traces]="traces"
      [types]="types"
      (filteredTraces)="filterTraces($event)"
    ></zp-stack-filter>
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
        <tr *ngFor="let trace of filtered" [ngClass]="getRowCssClass(trace)">
          <td>{{ trace.n }}</td>
          <td>{{ trace.type }}</td>
          <td>
            <zp-lazy-json
              *ngIf="trace.type == 'MS'"
              [value]="trace.data"
              [placeholder]="trace.data.name"
            ></zp-lazy-json>
            <zp-lazy-json
              *ngIf="trace.type == 'ME'"
              [value]="trace.data"
              [placeholder]="trace.data.name"
            ></zp-lazy-json>
            <zp-lazy-json
              *ngIf="trace.type == 'USR'"
              [value]="trace.data"
            ></zp-lazy-json>
          </td>
          <td>{{ trace.owner }}</td>
        </tr>
      </tbody>
    </table>
  `,
  styleUrls: ['stack-trace.component.scss'],
})
export class StackTraceComponent {
  filtered: Trace[] = [];
  types: ViewTypeFilter[] = [
    { label: 'MS', selected: true },
    { label: 'ME', selected: true },
    { label: 'USR', selected: true },
  ];

  @Input() traces: Trace[] = [];

  filterTraces(filteredTraces: Trace[]) {
    this.filtered = filteredTraces;
  }

  getRowCssClass(trace: Trace) {
    return {
      Trace: true,
      [`Trace--${trace.type}`]: true,
      'TraceStatus--Error': trace.error == true,
    };
  }
}
