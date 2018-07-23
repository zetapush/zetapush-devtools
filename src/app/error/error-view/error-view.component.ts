import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

// Routing
import { ActivatedRoute } from '@angular/router';

// Utils
import { Authentication, Client, services as SERVICES } from 'zetapush-js';
import { saveAs } from 'file-saver';
import { NGXLogger } from 'ngx-logger';
import { DataSource } from '@angular/cdk/collections';

// Interfaces
import {
  Trace,
  TraceCompletion,
  parseTraceLocation,
  TraceType,
  errorTrace,
} from '../../api/interfaces/trace.interface';

// Services
import { PreferencesStorage } from '../../api/services/preferences-storage.service';
import { SandboxService } from '../../api/services/sandbox.service';

// Guards
import { CanLeaveViewGuard } from '../../api/guards/canleaveview.guard';

// RxJS
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest as combine } from 'rxjs';
import { combineLatest } from 'rxjs/operators/combineLatest';
import { distinctUntilChanged } from 'rxjs/operators';
import { map } from 'rxjs/operators/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/merge';

// Material
import {
  MatTable,
  MatPaginator,
  PageEvent,
  MatTableDataSource,
} from '@angular/material';

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
  styleUrls: ['./error-view.component.scss'],
  animations: [
    trigger('expendRow', [
      state('collapsed', style({ display: 'none' })),
      state('expanded', style({ display: 'flex', backgroundColor: 'red' })),
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
  initialized = false;
  // table variables
  columns = ['ctx', 'code', 'owner', 'time'];
  dataSource: errorTrace[] = [];
  @ViewChild(MatTable) table: MatTable<any>;
  // Pagination
  nbErrors: number = 999;
  // Filter
  filteredSource: errorTrace[] = [];

  traceCounter: number = 1;

  constructor(
    private preferences: PreferencesStorage,
    private route: ActivatedRoute,
    private logger: NGXLogger,
    private guard: CanLeaveViewGuard,
    private sandBoxService: SandboxService,
  ) {
    combine(route.params, route.data)
      .pipe(
        distinctUntilChanged(
          (current, next) => current[0].sandboxId === next[0].sandboxId,
        ),
      )
      .subscribe(([params, data]) => {
        this.logger.log('ErrorViewComponent::route', params, data);
        if (this.initialized) {
          guard.canDeactivate().then((can) => {
            if (can) {
              this.sandboxId = params.sandboxId;
              this.services = data.services;
            }
          });
        } else {
          this.initialized = true;
          this.sandboxId = params.sandboxId;
          this.services = data.services;
        }
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
