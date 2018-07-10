import { Component } from '@angular/core';
import { of as observableOf } from 'rxjs';

// Interfaces
import { FileNode } from '../../api/interfaces/tree.interface';

// Services
import { FileDatabase } from '../../api/services/file-database.service';

// Tree
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

/**
 * @title Tree with nested nodes
 */
@Component({
  selector: 'zp-about-tree',
  templateUrl: 'about-tree.component.html',
  styleUrls: [], //
  providers: [FileDatabase],
})
export class AboutTreeComponent {
  nestedTreeControl: NestedTreeControl<FileNode>;
  nestedDataSource: MatTreeNestedDataSource<FileNode>;

  constructor(database: FileDatabase) {
    this.nestedTreeControl = new NestedTreeControl<FileNode>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();

    database.dataChange.subscribe((data) => {
      (this.nestedDataSource.data = data),
        console.log(this.nestedDataSource.data);
    });
  }

  // return true if the node's type doesn't exists ??? what the heck is dis hasNestedChild ???
  hasNestedChild = (_: number, nodeData: FileNode) =>
    nodeData.children.length > 0;

  // return an observable of the node children
  private _getChildren = (node: FileNode) => observableOf(node.children);
}
