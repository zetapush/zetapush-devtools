import {
  Component,
  OnChanges,
  Input,
  ElementRef,
  ViewChild,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import JSONFormatter from 'json-formatter-js';

import { Trace } from './trace.interface';

@Component({
  selector: 'zp-json-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="json-viewer" #jsonViewer></div>`,
  styles: [],
})
export class JsonViewerComponent implements OnChanges {
  @ViewChild(`jsonViewer`)
  input: ElementRef;
  open = 1;

  @Input() json: Array<any> | Object | any;
  @Input() collapsed: boolean;
  @Input() collapsedTrace: any;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    // Do nothing without data
    if (!this.json || (changes.collapsed && !changes.json)) {
      return;
    }

    // Toggle collapse for all traces in the terminal
    if (changes.collapsedTrace && !changes.collapsedTrace.firstChange) {
      const openAll: number = changes.collapsedTrace.currentValue.toggle
        ? 1
        : Infinity;

      this.input.nativeElement.innerHTML = '';
      this._renderJSON(changes.collapsedTrace.currentValue.trace, openAll);

      return;
    }

    // Toggle collapse trace output
    if (changes.collapsed && !changes.collapsed.currentValue) {
      this.open = Infinity;
    }

    this._renderJSON(this.json, this.open);
  }

  private _renderJSON(json: any, open: number) {
    const formatter = new JSONFormatter(json, open, {
      theme: 'dark',
    });
    this.input.nativeElement.appendChild(formatter.render());
  }
}
