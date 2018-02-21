import {
  Component,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  Input,
  AfterViewChecked,
} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

import { Sandbox } from './../../api/interfaces/sandbox.interface';
import { SandboxService } from './../../api/services/sandbox.service';
import { DebugStatusApi } from './../../api/services/debug-status-api.service';

@Component({
  selector: 'zp-sidenav',
  styleUrls: ['sidenav.component.scss'],
  templateUrl: 'sidenav.component.html',
})
export class SidenavComponent implements OnInit, OnDestroy, AfterViewChecked {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  sandboxes: Sandbox[] = [];

  @Input() toggle: boolean;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private sandboxService: SandboxService,
    private debugService: DebugStatusApi,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.getSandboxes();

    // Subscribe to the debug state change
    this.debugService.subject.subscribe(data => {
      for (let i = 0, length = this.sandboxes.length; i < length; i++) {
        if (
          this.sandboxes[i].businessId === data.sandboxId &&
          this.sandboxes[i].debug !== data.debug
        ) {
          this.sandboxes[i].debug = data.debug;
        }
      }
    });
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  /**
   * Retrive the mode of the sidenav according to the type of device
   */
  getMode() {
    return this.mobileQuery.matches ? 'over' : 'side';
  }

  /**
   * Prepares sandboxes to display them in the sidenav
   */
  async getSandboxes() {
    let services: string[];
    this.sandboxes = await this.sandboxService.getSandboxes();

    for (let i = 0, length = this.sandboxes.length; i < length; i++) {
      // Initialize the debug status
      this.sandboxes[i].debug = false;

      services = await this.sandboxService.getSandboxServices(
        this.sandboxes[i].businessId,
      );
      for (let j = 0, lengthJ = services.length; j < lengthJ; j++) {
        const status = await this.debugService.status(
          this.sandboxes[i].businessId,
          services[j],
        );

        if (status.debug) {
          this.sandboxes[i].debug = true;
        }
      }
    }
  }
}
