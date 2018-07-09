import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Interfaces
import { FileNode } from '../interfaces/tree.interface';
import { Trace } from '../interfaces/trace.interface';

// Tree
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

@Injectable({
  providedIn: 'root',
})
export class TreeBuilder {
  /*dataChange = new BehaviorSubject<FileNode[]>([]);
    nestedTreeControl: NestedTreeControl<FileNode>;
    nestedDataSource: MatTreeNestedDataSource<FileNode>;*/

  constructor() {}

  buildTreeFromTrace(traces: Trace[], index: number): FileNode[] {
    let accumulator: FileNode[] = [];
    for (let i = index; i < traces.length; i++) {
      const node: FileNode = new FileNode();
      node.filename = traces[i].data.toString();
      node.type = traces[i].type.toString();
      node.children = [];

      for (
        let j = i + 1;
        j < traces.length && traces[j].indent == traces[i].indent + 1;
        j++
      ) {
        node.children = this.buildTreeFromTrace(traces, j);
        i++;
      }

      accumulator.push(node);
    }
    return accumulator;
  }

  displayTree(tree: FileNode[]): string {
    let result: string = ' [ ';
    tree.forEach((element) => {
      result += element.filename;
      if (element.children != []) {
        result += this.displayTree(element.children);
      }
      result += ',';
    });
    result += ' ] ';
    return result;
  }
}
