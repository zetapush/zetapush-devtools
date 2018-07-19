// Panneau latéral ouvert lors d'un clic sur une ligne

import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

// Interfaces
import { ViewTypeFilter } from '../../api/interfaces/type-filter.interface';
import { Trace } from '../../api/interfaces/trace.interface';

// Tree
import {
  MatTreeNestedDataSource,
  MatNestedTreeNode,
} from '@angular/material/tree';

@Component({
  selector: 'zp-stack-trace',
  template: `
    <span class="navigation">
      <button mat-raised-button (click)="onNavigationClick('bwd')" disabled={{navigationBwdDisabled}}>
        <mat-icon>navigate_before</mat-icon>
      </button>
      <button mat-raised-button (click)="onNavigationClick('fwd')" disabled={{navigationFwdDisabled}}>
        <mat-icon>navigate_next</mat-icon>
      </button>
      <span class="trace-info">
        <p><strong>Trace ID</strong> : {{traceId}}</p>
        <p><strong>owner</strong> : {{traceOwner}}</p>
      </span>
    </span>
    <zp-stack-filter [types]="types" (filteredTraces)="filterTraces($event)" (filteredDisplay)="filterDisplay($event)"></zp-stack-filter>
    <zp-stack-list *ngIf="display == 'List'" [traces]="traces" [filter]="types"></zp-stack-list>
    <zp-stack-tree *ngIf="display == 'Tree'" [traces]="traces" [filter]="types"></zp-stack-tree>
  `,
  styles: ['stack-trace.component.css'],
  providers: [],
})
export class StackTraceComponent {
  @Input() navigationBwdDisabled: boolean;
  @Input() navigationFwdDisabled: boolean;
  @Input() traces: Trace[] = []; //données injectées par variable selection de trace-view
  @Output() traceDirection = new EventEmitter<string>();

  traceId: number = 0;
  traceOwner: string = '';

  filtered: Trace[] = [];
  display: String = 'Tree';
  types: ViewTypeFilter[] = [
    { label: 'MS', selected: true },
    { label: 'ME', selected: true },
    { label: 'CMT', selected: false },
    { label: 'USR', selected: true },
  ];

  constructor() {}

  ngOnChanges() {
    try {
      this.traceId = this.traces[0].ctx;
      this.traceOwner = this.traces[0].owner;
    } catch {}
  }

  filterTraces(filter: ViewTypeFilter[]) {
    this.types = filter;
  }

  filterDisplay(filteredDisplay: string) {
    this.display = filteredDisplay;
  }

  onNavigationClick(direction: string) {
    this.traceDirection.emit(direction);
  }
}
