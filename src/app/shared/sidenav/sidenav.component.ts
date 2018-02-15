import {
  Component,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  Input,
  AfterViewChecked,
} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'zp-sidenav',
  styleUrls: ['sidenav.component.scss'],
  templateUrl: 'sidenav.component.html',
})
export class SidenavComponent implements OnInit, OnDestroy, AfterViewChecked {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  @Input() toggle: boolean;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {}

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
}
