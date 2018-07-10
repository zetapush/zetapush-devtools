import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Interfaces
import { TreeNode } from '../interfaces/tree.interface';
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
  recursiveLength(node: TreeNode): number {
    let length: number = 0;
    node.children.forEach((element) => {
      length += this.recursiveLength(element) + 1;
    });
    return length;
  }

  // auxiliary function that convert a trace input into a Node output
  traceToNode(trace: Trace): TreeNode {
    const node = new TreeNode();
    node.data = trace.data;
    node.name = trace.data.name;
    node.type = trace.type.toString();
    node.children = [];
    node.number = trace.n;
    node.owner = trace.owner;

    return node;
  }

  // a function applyed on an array of traces, to transform it into data that can be displayed by the mat-tree tag
  // TODO recursive length, and recursive nesting. Then, trying to find why css is foiring
  buildTreeFromTrace(traces: Trace[], begin: number): TreeNode[] {
    let accumulator: TreeNode[] = [];
    accumulator.push(this.traceToNode(traces[begin]));
    console.log('damn');

    for (let i = 1 + begin; i < traces.length; i++) {
      const node: TreeNode = this.traceToNode(traces[i]);
      console.log(i);
      if (traces[i - 1].indent < traces[i].indent) {
        node.children = this.buildTreeFromTrace(traces, i);
        i = +this.recursiveLength(node);
      }
      accumulator.push(node);
    }
    console.log('hey');
    return accumulator;
  }

  displayTree(tree: TreeNode[]): string {
    let result: string = ' [ ';
    tree.forEach((element) => {
      result += element.name;
      if (element.children != []) {
        result += this.displayTree(element.children);
      }
      result += ',';
    });
    result += ' ] ';
    return result;
  }
}
