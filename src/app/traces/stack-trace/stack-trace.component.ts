// Panneau latéral ouvert lors d'un clic sur une ligne

import { Component, Input, OnInit } from '@angular/core';

// Interfaces
import { TreeNode } from '../../api/interfaces/tree.interface';
import { ViewTypeFilter } from '../../api/interfaces/type-filter.interface';
import { Trace } from '../../api/interfaces/trace.interface';

// Tree
import {
  MatTreeNestedDataSource,
  MatNestedTreeNode,
} from '@angular/material/tree';

// Service
import { TreeBuilder } from '../../api/services/tree-building.service';

@Component({
  selector: 'zp-stack-trace',
  template: `
    <zp-stack-filter [traces]="traces" [types]="types" (filteredTraces)="filterTraces($event)" (filteredDisplay)="filterDisplay($event)"></zp-stack-filter>
    <zp-stack-list *ngIf="display == 'List'" [traces]="traces" [filter]="types"></zp-stack-list>
    <zp-stack-tree *ngIf="display == 'Tree'" [nestedDataSource]="nestedDataSource" [filter]="types"></zp-stack-tree>
  `,

  styleUrls: ['stack-trace-tree.component.css'],
  providers: [],
})
export class StackTraceComponent {
  @Input() traces: Trace[] = []; //données injectées par variable selection de trace-view
  nestedDataSource: MatTreeNestedDataSource<TreeNode>;

  filtered: Trace[] = [];
  display: String = 'Tree';
  types: ViewTypeFilter[] = [
    { label: 'MS', selected: true },
    { label: 'ME', selected: true },
    { label: 'CMT', selected: false },
    { label: 'USR', selected: true },
  ];

  ngOnInit() {}

  ngOnChanges() {
    if (this.traces.length) {
      this.builder.setIndent(this.traces);
      this.nestedDataSource.data = this.builder.buildTreeFromTrace(
        this.traces,
        0,
      );
    }
  }

  constructor(private builder: TreeBuilder) {
    this.nestedDataSource = new MatTreeNestedDataSource();
  }

  filterTraces(filter: ViewTypeFilter[]) {
    //this.filtered = filteredTraces;
    this.types = filter;
    console.log(this.types);
  }

  filterDisplay(filteredDisplay: string) {
    this.display = filteredDisplay;
  }
}
