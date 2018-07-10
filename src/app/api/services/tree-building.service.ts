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
      length += this.recursiveLength(element) + 1;
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
  buildTreeFromTrace(traces: Trace[], begin: number): FileNode[] {
    let accumulator: FileNode[] = [];
    accumulator.push(this.traceToNode(traces[begin]));
    console.log('damn');

    for (let i = 1 + begin; i < traces.length; i++) {
      const node: FileNode = this.traceToNode(traces[i]);
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

  unitTest(): number {
    let node1: FileNode = new FileNode();
    node1.filename = 'node1';
    node1.type = 'node';
    let node2: FileNode = new FileNode();
    node2.filename = 'node2';
    node2.type = 'node';
    node2.children = [];
    let node3: FileNode = new FileNode();
    node3.filename = 'node3';
    node3.type = 'node';
    let node4: FileNode = new FileNode();
    node4.filename = 'node4';
    node4.type = 'node';
    node4.children = [];
    let node5: FileNode = new FileNode();
    node5.filename = 'node5';
    node5.type = 'node';
    node5.children = [];

    node3.children = [node4, node5];
    node1.children = [node2, node3];
    return this.recursiveLength(node1);
  }
}
