import { Component, OnInit, Input } from '@angular/core';

// Tree
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

// Interfaces
import { TreeNode } from '../../api/interfaces/tree.interface';
import { ViewTypeFilter } from '../../api/interfaces/type-filter.interface';

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
  @Input() filter: ViewTypeFilter[];

  constructor() {
    this.nestedTreeControl = new NestedTreeControl<TreeNode>(this._getChildren);
  }

  ngOnInit() {}

  hasNestedChild = (_: number, nodeData: TreeNode) => nodeData.children.length;

  // return true if the data node is to be displayed
  isFiltered = (nodeData: TreeNode) => {
    let filterOn: boolean = true;
    this.filter.map((value) => {
      if (value.label == nodeData.type) {
        filterOn = value.selected;
      }
    });
    return filterOn;
  };

  private _getChildren = (node: TreeNode) => observableOf(node.children);

  /*checkFilter (type: string) : boolean {
    
  }*/
}
