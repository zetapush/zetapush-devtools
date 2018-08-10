import { Component, OnInit } from '@angular/core';

// Network
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Interface
import { Trace } from '../../api/interfaces/trace.interface';

// RxJS
import { Observable } from 'rxjs';

@Component({
  selector: 'zp-error-view',
  templateUrl: './error-view.component.html',
})
export class ErrorViewComponent {
  requestUrl: string = 'http://localhost:9200/kermit/_search?q=ctx:162';
  traceDisplay: Trace;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getRequestResult(this.requestUrl).subscribe((value) => {
      (this.traceDisplay = value[0]), console.log(this.traceDisplay);
    });
  }

  getRequestResult(url: string): Observable<Trace[]> {
    return this.http.get<Trace[]>(url);
  }
}

// http://localhost:9200/kermit/_search?q=ctx:162
