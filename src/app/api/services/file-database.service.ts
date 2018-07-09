import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Interfaces
import { FileNode } from '../interfaces/tree.interface';
import { Trace } from '../interfaces/trace.interface';

/**
 * The Json tree data in string. The data could be parsed into Json object
 */
const TREE_DATA = JSON.stringify({
  Applications: {
    Calendar: 'app',
    Chrome: 'app',
    Webstorm: 'app',
  },
  Documents: {
    angular: {
      src: {
        compiler: 'ts',
        core: 'ts',
      },
    },
    material2: {
      src: {
        button: 'ts',
        checkbox: 'ts',
        input: 'ts',
      },
    },
  },
  Downloads: {
    October: 'pdf',
    November: 'pdf',
    Tutorial: 'html',
  },
  Pictures: {
    'Photo Booth Library': {
      Contents: 'dir',
      Pictures: 'dir',
    },
    Sun: 'png',
    Woods: 'jpg',
  },
});

/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
@Injectable()
export class FileDatabase {
  dataChange = new BehaviorSubject<FileNode[]>([]);

  get data(): FileNode[] {
    return this.dataChange.value;
  }

  constructor() {
    this.initialize();
  }

  initialize() {
    // Parse the string to json object.
    const dataObject = JSON.parse(TREE_DATA);

    // Build the tree nodes from Json object. The result is a list of `FileNode` with nested
    //     file node as children.
    const data = this.buildFileTree(dataObject, 0); // -------------- buildTreeFromNode (selection) puis push sur stack-trace.compoenent
    console.log('------');
    console.log(data);

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `FileNode`.
   */
  buildFileTree(obj: object, level: number): FileNode[] {
    return Object.keys(obj).reduce<FileNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new FileNode();
      node.filename = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.type = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  /*
  Build an array of FileNode from an array of Trace recursively, in a way that each node beneath another in the tree hierarchy is a children of the upper node
  */
  buildTreeFromTrace(traces: Trace[], index: number): FileNode[] {
    let accumulator: FileNode[];
    for (let i = index; i < traces.length; i++) {
      const node: FileNode = new FileNode();
      node.filename = traces[i].data;
      node.type = traces[i].type;

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
}
