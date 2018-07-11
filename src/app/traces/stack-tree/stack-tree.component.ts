import { Component, OnInit, Input } from '@angular/core';

// Tree
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

// Interfaces
import { TreeNode } from '../../api/interfaces/tree.interface';

// RxJS
import { of as observableOf } from 'rxjs';

@Component({
  selector: 'zp-stack-tree',
  templateUrl: './stack-tree.component.html',
  styleUrls: ['./stack-tree.component.css', './stack-tree.component.scss'],
})
export class StackTreeComponent implements OnInit {
  nestedTreeControl: NestedTreeControl<TreeNode>;
  @Input() nestedDataSource: MatTreeNestedDataSource<TreeNode>;
  // TODO nestedDataSource à importer, puis faire des tests sur la fonctionnalitée

  constructor() {
    this.nestedTreeControl = new NestedTreeControl<TreeNode>(this._getChildren);
  }

  ngOnInit() {}

  hasNestedChild = (_: number, nodeData: TreeNode) => nodeData.children.length;

  private _getChildren = (node: TreeNode) => observableOf(node.children);
}
