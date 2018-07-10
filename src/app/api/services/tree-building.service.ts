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

  // function to set the different lvls that the traces will take in the tree
  setIndex(traces: Trace[]) {
    let indentCounter: number = 1;
    traces.forEach((element) => {
      if (element.type === 'ME') {
        indentCounter--;
      }
      element.indent = indentCounter;
      if (element.type === 'MS') {
        indentCounter++;
      }
    });
  }

  // auxiliary function that calculate the number of nodes as child of the one in parameter, or child of the childens ...
  recursiveLength(node: FileNode): number {
    let length: number = 0;
    node.children.forEach((element) => {
      length += this.recursiveLength(element);
    });
    return length;
  }

  // auxiliary function that convert a trace input into a Node output
  traceToNode(trace: Trace): FileNode {
    const node = new FileNode();
    node.filename = trace.data.toString();
    node.type = trace.type.toString();
    node.children = [];

    return node;
  }

  // a function applyed on an array of traces, to transform it into data that can be displayed by the mat-tree tag
  // TODO recursive length, and recursive nesting. Then, trying to find why css is foiring
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
