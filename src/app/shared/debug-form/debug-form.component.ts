import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatSlideToggleChange } from '@angular/material';

import { NGXLogger } from 'ngx-logger';

import {
  DebugStatus,
  DebugStatusApi,
} from '../../api/services/debug-status-api.service';

export interface DebugStatusView extends DebugStatus {
  deploymentId: string;
}

@Component({
  selector: 'zp-debug-form',
  template: `
    <form (ngSubmit)="onSubmit(form)" novalidate #form="ngForm">
      <div class="Container Container--All">
        <mat-slide-toggle
          [disabled]="models.length === 0"
          [checked]="checked"
          (change)="onChangeDebugStatus($event)"
          class="Slide Slide--All"
          labelPosition="before">
            All :
        </mat-slide-toggle>
      </div>
      <div class="Container Container--Services">
        <mat-slide-toggle class="Slide Slide--Model" *ngFor="let model of models"
          [checked]="model.debug"
          (change)="onChangeDebugStatusByModel(model, $event)"
          labelPosition="before">
            {{model.deploymentId}} :
        </mat-slide-toggle>
        <span *ngIf="models.length === 0">No macro services deployed</span>
      </div>
    </form>
  `,
  styles: [
    `
    form { display: flex; flex-direction: row; border: 1px solid #f5f5f5; }
    .Container {
      padding: 0.5rem;
    }
    .Container--All {
      border-right: 1px solid #f5f5f5;
    }
    .Slide--Model {
      padding-right: 0.5rem;
    }
  `,
  ],
})
export class DebugFormComponent implements OnChanges, OnInit {
  @Input() sandboxId: string;
  @Input() services: string[] = [];

  models: DebugStatusView[] = [];
  checked = false;

  constructor(private debug: DebugStatusApi, private logger: NGXLogger) {}

  ngOnChanges(changes: SimpleChanges) {
    this.logger.log('DebugFormComponent::ngOnInit', changes);
  }

  async ngOnInit() {
    this.logger.log('DebugFormComponent::ngOnInit', this.services);
    this.fetch();
    this.logger.log('DebugFormComponent::ngOnInit', this.models);
  }

  async fetch() {
    const models = await Promise.all(
      this.services.map(deploymentId =>
        this.debug.status(this.sandboxId, deploymentId).then(status => ({
          deploymentId,
          ...status,
        })),
      ),
    );
    this.checked = models.reduce((enabled, next) => {
      enabled = enabled && next.debug;
      return enabled;
    }, models.length > 0);
    this.models = models;
    this.logger.log('DebugFormComponent::fetch', models);
    return await models;
  }

  async onSubmit({ value, valid }: { value: any; valid: boolean }) {
    this.logger.log('DebugFormComponent::onSubmit', { valid, value });
  }

  async onChangeDebugStatusByModel(
    model: DebugStatusView,
    change: MatSlideToggleChange,
  ) {
    this.logger.log(
      'DebugFormComponent::onChangeDebugStatusByModel',
      model,
      change,
    );
    if (change.checked) {
      await this.debug.enable(this.sandboxId, model.deploymentId);
    } else {
      await this.debug.disable(this.sandboxId, model.deploymentId);
    }
    await this.fetch();
  }

  async onChangeDebugStatus(change: MatSlideToggleChange) {
    this.logger.log('DebugFormComponent::onChangeDegugStatus', change);
    if (change.checked) {
      await Promise.all(
        this.models.map(model =>
          this.debug.enable(this.sandboxId, model.deploymentId),
        ),
      );
    } else {
      await Promise.all(
        this.models.map(model =>
          this.debug.disable(this.sandboxId, model.deploymentId),
        ),
      );
    }
    await this.fetch();
  }
}
