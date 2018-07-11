// Panneau latéral ouvert lors d'un clic sur une ligne

import { Component, Input, OnInit } from '@angular/core';

// Interfaces
import { TreeNode } from '../../api/interfaces/tree.interface';
import { ViewTypeFilter } from '../../api/interfaces/type-filter.interface';
import { Trace } from '../../api/interfaces/trace.interface';

// Tree
import { MatTreeNestedDataSource } from '@angular/material/tree';

@Component({
  selector: 'zp-stack-trace',
  template: `
    <zp-stack-filter [traces]="traces" [types]="types" (filteredTraces)="filterTraces($event)" (filteredDisplay)="filterDisplay($event)"></zp-stack-filter>
    <zp-stack-list *ngIf="display == 'List'" [traces]="filtered"></zp-stack-list>
    <zp-stack-tree *ngIf="display == 'Tree'" [nestedDataSource]="nestedDataSource"></zp-stack-tree>
  `,

  styleUrls: ['stack-trace-tree.component.css'],
  providers: [],
})
export class StackTraceComponent {
  @Input() traces: Trace[] = []; //données injectées par variable selection de trace-view
  @Input() nestedDataSource: MatTreeNestedDataSource<TreeNode>;

  filtered: Trace[] = [];
  display: String = 'Tree';
  types: ViewTypeFilter[] = [
    { label: 'MS', selected: true },
    { label: 'ME', selected: true },
    { label: 'CMT', selected: false },
    { label: 'USR', selected: true },
  ];

  filterTraces(filteredTraces: Trace[]) {
    this.filtered = filteredTraces;
  }

  filterDisplay(filteredDisplay: string) {
    this.display = filteredDisplay;
  }

  ngOnInit() {}

  constructor() {}
}
