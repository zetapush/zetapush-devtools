import {
  Component,
  OnChanges,
  Input,
  ElementRef,
  ViewChild,
  Renderer,
} from '@angular/core';
import { isObject } from 'rxjs/util/isObject';
import { isArray } from 'rxjs/util/isArray';
import JSONFormatter from 'json-formatter-js';

@Component({
  selector: 'zp-json-viewer',
  template: `<div #jsonViewer></div>`,
  styles: [],
})
export class JsonViewerComponent implements OnChanges {
  @ViewChild(`jsonViewer`)
  input: ElementRef;
  open: number;

  @Input() json: Array<any> | Object | any;
  @Input() collapsed: boolean;

  constructor() {
    this.open = 1;
    console.log('constructor !!!!');
  }

  ngOnChanges(changes) {
    console.log(changes.collapsed);
    console.log(this.open);

    if (!changes.collapsed.currentValue) {
      console.log('pass');
      this.open = Infinity;
    }

    // Do nothing without data
    if (
      (!isObject(this.json) && !isArray(this.json)) ||
      (changes.collapsed && !changes.json)
    ) {
      return;
    }

    const formatter = new JSONFormatter(this.json, this.open, {
      theme: 'dark',
    });
    this.input.nativeElement.appendChild(formatter.render());
  }
}
