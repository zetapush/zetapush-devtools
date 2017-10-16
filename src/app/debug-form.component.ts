import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatSlideToggleChange } from '@angular/material';
import { DebugStatus, DebugStatusApi } from './debug-status-api.service';

export interface DebugStatusView extends DebugStatus {
  deploymentId: string;
}

@Component({
  selector: 'zp-debug-form',
  template: `
    <form (ngSubmit)="onSubmit(form)" novalidate #form="ngForm">
      <div class="Container Container--All">
        <mat-slide-toggle
        [checked]="checked"
          (change)="onChangeDebugStatus($event)"
          labelPosition="before">
            All :
        </mat-slide-toggle>
      </div>
      <div class="Container Container--Services">
        <mat-slide-toggle *ngFor="let model of models"
          [checked]="model.debug"
          (change)="onChangeDebugStatusByModel(model, $event)"
          labelPosition="before">
            {{model.deploymentId}} :
        </mat-slide-toggle>
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
  `,
  ],
})
export class DebugFormComponent implements OnChanges, OnInit {
  @Input() sandboxId: string;
  @Input() services: string[] = [];

  models: DebugStatusView[] = [];
  checked = false;

  constructor(private debug: DebugStatusApi) {}

  ngOnChanges(changes: SimpleChanges) {
    console.log('DebugFormComponent::ngOnInit', changes);
  }

  async ngOnInit() {
    console.log('DebugFormComponent::ngOnInit', this.services);
    this.fetch();
    console.log('DebugFormComponent::ngOnInit', this.models);
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
    }, true);
    this.models = models;
    console.log('DebugFormComponent::fetch', models);
    return await models;
  }

  async onSubmit({ value, valid }: { value: any; valid: boolean }) {
    console.log('DebugFormComponent::onSubmit', { valid, value });
  }

  async onChangeDebugStatusByModel(
    model: DebugStatusView,
    change: MatSlideToggleChange,
  ) {
    console.log(
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
    console.log('DebugFormComponent::onChangeDegugStatus', change);
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
