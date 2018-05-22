import {
  Directive,
  ElementRef,
  OnInit,
  AfterContentInit,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { NGXLogger } from 'ngx-logger';

@Directive({
  selector: '[zpScrollGlue]',
})
export class ScrollGlueDirective
  implements OnInit, AfterContentInit, OnDestroy {
  public el: any;
  public isTop: any = new Subject();
  public isLocked: any = true;
  private _observer: any;
  private _oldScrollHeight: any = 0;
  private observerConfig = {
    attributes: false,
    childList: true,
    characterData: false,
  };

  constructor(private _el: ElementRef, private logger: NGXLogger) {
    this.el = _el.nativeElement;
    // To Improve
    this.isTop = new Subject();
  }

  ngOnInit() {}

  @HostListener('scroll')
  onScroll() {
    const scrollTop = this.el.scrollTop;

    if (scrollTop === 0) {
      this.isTop.next();
    }

    this.disableAutoScroll();
  }

  ngAfterContentInit() {
    this.el.scrollTop = this.el.scrollHeight;

    // create an observer instance
    this._observer = new MutationObserver((mutations) => {
      this.logger.log('ScrollGlueDirective::MutationObserver', {
        scrollHeight: this.el.scrollHeight,
        scrollTop: this.el.scrollTop,
        isLocked: this.isLocked,
        mutations,
      });

      if (this.isLocked) {
        this.el.scrollTop = this.el.scrollHeight;
        setTimeout(() => {
          this._oldScrollHeight = this.el.scrollHeight;
          // this.el.scrollTop = this.el.scrollHeight
        }, 0);
      }
    });

    const target = this.el;

    // pass in the target node, as well as the observer options
    this._observer.observe(target, this.observerConfig);

    this.logger.log('ScrollGlueDirective::ngAfterContentInit', {
      el: this.el,
      observer: this._observer,
    });
  }

  ngOnDestroy() {
    /**
     * To Fix
     */
    if (this._observer) {
      this._observer.disconnect();
    }
  }

  /**
   * Disable scrollGlue if user is not at the bottom of the view
   */
  disableAutoScroll() {
    const scrollTop = this.el.scrollTop;
    const scrollHeight = this.el.scrollHeight;
    const clientHeight = this.el.clientHeight;

    if (scrollHeight - scrollTop === clientHeight) {
      this.isLocked = true;
    } else {
      this.isLocked = false;
    }
  }
}
