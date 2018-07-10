// Panneau latéral ouvert lors d'un clic sur une ligne

import { Component, Input, OnInit } from '@angular/core';

// RxJS
import { of as observableOf } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

// Interfaces
import { FileNode } from '../../api/interfaces/tree.interface';
import { ViewTypeFilter } from '../../api/interfaces/type-filter.interface';
import { Trace } from '../../api/interfaces/trace.interface';

// Services
import { TreeBuilder } from '../../api/services/tree-building.service';

// Tree
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

// MatTreeModule imported in traces.module, for otherwise it doesn't work

@Component({
  selector: 'zp-stack-trace',
  template: `
    <zp-stack-filter [traces]="traces" [types]="types" (filteredTraces)="filterTraces($event)"></zp-stack-filter>
    <table>
      <thead>
        <tr>
          <th>N</th>
          <th>Type</th>
          <th>Content</th>
          <th>Owner</th>
          <th>Indent</th>
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
          <td>{{trace.indent}}</td>
        </tr>
      </tbody>
    </table>

    <mat-tree [dataSource]="nestedDataSource" [treeControl]="nestedTreeControl" class="example-tree">
      <mat-tree-node *matTreeNodeDef="let node" matTreeNodeToggle>
        <li class="mat-tree-node">
          <button mat-icon-button disabled></button>
          {{node.filename}}:  {{node.type}}
        </li>
      </mat-tree-node>

      <mat-nested-tree-node *matTreeNodeDef="let node; when: hasNestedChild">
        <li>
          <div class="mat-tree-node">
            <button mat-icon-button matTreeNodeToggle
                    [attr.aria-label]="'toggle ' + node.filename">
              <mat-icon class="mat-icon-rtl-mirror">
                {{nestedTreeControl.isExpanded(node) ? 'expand_more' : 'chevron_right'}}
              </mat-icon>
            </button>
            {{node.filename}}
          </div>
          <ul [class.example-tree-invisible]="!nestedTreeControl.isExpanded(node)">
            <ng-container matTreeNodeOutlet></ng-container>
          </ul>
        </li>
      </mat-nested-tree-node>
    </mat-tree>

      
  `,
  styleUrls: ['stack-trace-tree.component.css', 'stack-trace.component.scss'],
  providers: [],
})
export class StackTraceComponent {
  @Input() traces: Trace[] = []; //données injectées par variable selection de trace-view
  nestedTreeControl: NestedTreeControl<FileNode>; //nestedTreeControl
  @Input() nestedDataSource: MatTreeNestedDataSource<FileNode>;
  filtered: Trace[] = [];
  types: ViewTypeFilter[] = [
    { label: 'MS', selected: true },
    { label: 'ME', selected: true },
    { label: 'CMT', selected: false },
    { label: 'USR', selected: true },
  ];

  filterTraces(filteredTraces: Trace[]) {
    this.filtered = filteredTraces;
  }

  ngOnInit() {}

  constructor() {
    this.nestedTreeControl = new NestedTreeControl<FileNode>(this._getChildren);
  }

  // return true if the node's type is false ??? what the heck is dis hasNestedChild ???
  hasNestedChild = (_: number, nodeData: FileNode) => nodeData.children.length;

  private _getChildren = (node: FileNode) => observableOf(node.children);
}
