import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Interfaces
import { FileNode } from '../interfaces/tree.interface';
import { Trace } from '../interfaces/trace.interface';

@Injectable({
  providedIn: 'root',
})
export class TreeBuilder {
  /*dataChange = new BehaviorSubject<FileNode[]>([]);
    nestedTreeControl: NestedTreeControl<FileNode>;
    nestedDataSource: MatTreeNestedDataSource<FileNode>;*/

  constructor() {}

  recursiveLength(node: FileNode): number {
    let length: number = 0;
    node.children.forEach((element) => {
      length += this.recursiveLength(element);
    });
    return length;
  }

  traceToNode(trace: Trace): FileNode {
    const node = new FileNode();
    node.filename = trace.data.toString();
    node.type = trace.type.toString();
    node.children = [];

    return node;
  }

  buildTreeFromTrace(traces: Trace[], index: number): FileNode[] {
    let accumulator: FileNode[] = [];
    for (let i = index; i < traces.length; i++) {
      const node: FileNode = this.traceToNode(traces[i]);

      let j = i + 1;
      let k = 0;
      while (j < traces.length && traces[j].indent == traces[i].indent + 1) {
        node.children.push(this.traceToNode(traces[j]));
        j++;
        k++;
      }
      i += k;
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
