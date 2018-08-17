import { Component, OnInit, ViewChild } from '@angular/core';

// Routing
import { ActivatedRoute } from '@angular/router';

// Utils
import { NGXLogger } from 'ngx-logger';

// Interfaces
import { ErrorTrace } from '../../api/interfaces/trace.interface';

// Guards
import { SandboxService } from '../../api/services/sandbox.service';

// RxJS
import { combineLatest as combine } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/merge';

// Material
import { MatTable, PageEvent } from '@angular/material';

// Animation
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

/** TODO
 * avoir des pretty traces clickables
 * css
 */

@Component({
  selector: 'zp-error-view',
  templateUrl: './error-view.component.html',
  styleUrls: ['./error-view.component.scss', './error-view.component.css'],
  animations: [
    trigger('expendRow', [
      state(
        'collapsed',
        style({ height: '0px', minHeight: '0', display: 'none' }),
      ),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ),
    ]),
  ],
})
export class ErrorViewComponent {
  // guard variables
  sandboxId: string;
  // table variables
  columns = ['time', 'code', 'owner'];
  dataSource: ErrorTrace[] = [];
  @ViewChild(MatTable) table: MatTable<any>;
  // Pagination
  nbErrors = 500;
  // Filter
  filteredSource: ErrorTrace[] = [];
  // Loader
  loading = false;

  // function to build an errorTrace from the traces that produces the sandBox service via getSandboxErrorPaginatedList
  private static format(error): ErrorTrace {
    return {
      code: error.error.code,
      owner: error.userId,
      ts: error.timestamp,
      details: error,
      isExpanded: false,
    };
  }

  constructor(
    private logger: NGXLogger,
    private api: SandboxService,
    route: ActivatedRoute,
  ) {
    combine(route.params, route.data)
      .pipe(
        distinctUntilChanged(
          (current, next) => current[0].sandboxId === next[0].sandboxId,
        ),
      )
      .subscribe(async ([params, data]) => {
        this.logger.log('ErrorViewComponent::route', params, data);
        this.sandboxId = params.sandboxId;
        this.setDataSource(await this.getSandboxErrorPaginatedList());
      });
  }

  private async getSandboxErrorPaginatedList(
    pageIndex = 0,
  ): Promise<ErrorTrace[]> {
    this.loading = true;
    const errors = this.api
      .getSandboxErrorPaginatedList(this.sandboxId, pageIndex)
      .then((value) => value.content.map(ErrorViewComponent.format));
    this.loading = false;
    return errors;
  }

  private setDataSource(errors: ErrorTrace[]): void {
    this.dataSource = errors;
    this.filteredSource = errors;
    this.table.renderRows();
  }

  async onChangePagination(event: PageEvent) {
    this.setDataSource(
      await this.getSandboxErrorPaginatedList(event.pageIndex),
    );
  }

  onCollapseClick() {
    this.setDataSource(
      this.dataSource.map((error) => ({
        ...error,
        isExpanded: false,
      })),
    );
  }

  onFiltering(filter: string) {
    this.filteredSource = this.dataSource;
    this.filteredSource = !filter
      ? this.filteredSource
      : this.filteredSource.filter(
          (value) =>
            value.code.toLowerCase().includes(filter.trim().toLowerCase()) ||
            value.owner.toLowerCase().includes(filter.trim().toLowerCase()),
        );
  }
}
