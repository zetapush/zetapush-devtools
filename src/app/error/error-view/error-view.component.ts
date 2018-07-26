import { Component, OnInit, ViewChild } from '@angular/core';

// Routing
import { ActivatedRoute } from '@angular/router';

// Utils
import { NGXLogger } from 'ngx-logger';

// Interfaces
import { errorTrace } from '../../api/interfaces/trace.interface';

// Services

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
export class ErrorViewComponent implements OnInit {
  // guard variables
  sandboxId: string;
  services: string[] = [];
  // table variables
  columns = ['ctx', 'code', 'owner', 'time'];
  dataSource: errorTrace[] = [];
  @ViewChild(MatTable) table: MatTable<any>;
  // Pagination
  nbErrors = 999;
  // Filter
  filteredSource: errorTrace[] = [];
  traceCounter = 1;

  constructor(
    private logger: NGXLogger,
    private sandBoxService: SandboxService,
    route: ActivatedRoute,
  ) {
    combine(route.params, route.data)
      .pipe(
        distinctUntilChanged(
          (current, next) => current[0].sandboxId === next[0].sandboxId,
        ),
      )
      .subscribe(([params, data]) => {
        this.logger.log('ErrorViewComponent::route', params, data);
        this.sandboxId = params.sandboxId;
        this.services = data.services;
      });
  }

  async ngOnInit() {
    await this.sandBoxService
      .getSandboxErrorPaginatedList(this.sandboxId)
      .then((value) => {
        value.content.forEach((element) => {
          this.dataSource.push(this.buildTrace(element));
        });
      });
    this.filteredSource = this.dataSource;
    this.table.renderRows();
  }

  // function to build an errorTrace from the traces that produces the sandBox service via getSandboxErrorPaginatedList
  buildTrace(error): errorTrace {
    const trace: errorTrace = {
      ctx: this.traceCounter,
      code: error.error.code,
      owner: error.userId,
      ts: error.timestamp,
      details: error,
      isExpanded: false,
    };
    this.traceCounter++;
    return trace;
  }

  async onChangePagination(event: PageEvent) {
    if (event.pageIndex < event.previousPageIndex) {
      this.traceCounter = this.traceCounter - 40;
    }
    this.dataSource = [];
    await this.sandBoxService
      .getSandboxErrorPaginatedList(this.sandboxId, event.pageIndex)
      .then((value) => {
        value.content.forEach((element) => {
          this.dataSource.push(this.buildTrace(element));
        });
      });
    this.filteredSource = this.dataSource;
    this.table.renderRows();
  }

  onCollapseClick() {
    this.dataSource.map((value) => {
      value.isExpanded = false;
    });
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
