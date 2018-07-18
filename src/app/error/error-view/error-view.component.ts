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
import {
  MatTable,
  MatPaginator,
  PageEvent,
  MatTableDataSource,
} from '@angular/material';

@Component({
  selector: 'zp-error-view',
  templateUrl: './error-view.component.html',
  styleUrls: ['./error-view.component.scss'],
})
export class ErrorViewComponent implements OnInit {
  // guard variables
  sandboxId: string;
  services: string[] = [];
  initialized = false;
  // variables for the pagination handling
  // @ViewChild(MatPaginator) paginator: MatPaginator; //TODO
  dataSource: errorTrace[] = [];
  // private dataSource: MatTableDataSource<errorTrace>,

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
        this.logger.log('TracesViewComponent::route', params, data);
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

  ngOnInit() {
    this.sandBoxService
      .getSandboxErrorPaginatedList(this.sandboxId)
      .then((value) => {
        value.content.forEach((element) => {
          this.dataSource.push(this.buildTrace(element));
        });
      });
  }

  // function to build an errorTrace from the traces that produces the sandBox service via getSandboxErrorPaginatedList
  buildTrace(error): errorTrace {
    const trace: errorTrace = {
      ctx: this.traceCounter,
      code: error.error.code,
      owner: error.userId,
      ts: error.timestamp,
    };
    this.traceCounter++;
    return trace;
  }
}
