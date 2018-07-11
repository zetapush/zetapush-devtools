import { Component, OnInit, Input } from '@angular/core';

// Interfaces
import { Trace } from '../../api/interfaces/trace.interface';

@Component({
  selector: 'zp-stack-list',
  templateUrl: './stack-list.component.html',
  styleUrls: ['./stack-list.component.scss'],
})
export class StackListComponent implements OnInit {
  @Input() traces: Trace[] = [];

  constructor() {}

  ngOnInit() {}
}
