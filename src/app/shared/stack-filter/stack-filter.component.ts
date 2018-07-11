// Barre de filtres avec checkboxes (affichée dans le stack-trace component)

import {
  Component,
  Input,
  OnDestroy,
  OnChanges,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  SimpleChanges,
} from '@angular/core';
import { MatCheckboxChange, MatButtonToggleModule } from '@angular/material';
import {
  Trace,
  TraceCompletion,
  TraceLocation,
  parseTraceLocation,
} from '../../api/interfaces/trace.interface';
import { ViewTypeFilter } from '../../api/interfaces/type-filter.interface';

@Component({
  selector: 'zp-stack-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
    .Form--Filter {
      font-weight: bold;
      margin-top: 10px;
      padding-left: 0.5rem;
    }
    .Filter {
      padding-right: 0.25rem;
    }
    `,
  ],
  template: `
    <form class="Form Form--Filter">
      <span>Filter: </span>
      <mat-checkbox *ngFor="let type of types" [checked]="type.selected" (change)="onChangeType($event, type)" name="filter" class="Filter">
        {{type.label}}
      </mat-checkbox>
      <mat-button-toggle-group name="displayStyle" #displayStyle="matButtonToggleGroup" (change)="onChangeDisplay(displayStyle.value)">
        <mat-button-toggle value="Tree">Tree</mat-button-toggle>
        <mat-button-toggle value="List">List</mat-button-toggle>
      </mat-button-toggle-group>

    </form>
  `,
})
export class StackFilterComponent implements OnChanges {
  @Input() traces: Trace[] = [];
  @Input() types: ViewTypeFilter[];

  @Output() filteredTraces = new EventEmitter<Trace[]>();
  @Output() filteredDisplay = new EventEmitter();

  ngOnChanges(changes: SimpleChanges) {
    this.filteredTraces.emit(this.filtered);
  }

  get filtered() {
    const types = this.types
      .filter((type) => type.selected)
      .map((type) => type.label);
    return this.traces
      ? this.traces.filter((trace) => types.includes(trace.type))
      : [];
  }

  onChangeType($event: MatCheckboxChange, type) {
    this.types = this.types.map((value) => {
      if (value.label === type.label) {
        value.selected = $event.checked;
      }
      return value;
    });

    this.filteredTraces.emit(this.filtered);
  }

  onChangeDisplay(choice: string) {
    this.filteredDisplay.emit(choice);
  }

  //displayStyle.value
}
