import {Component, EventEmitter, Input, Output} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MaterialComponent } from '../MaterialComponent';
import TimeComponent from 'formiojs/components/time/Time.js';
import * as moment_ from 'moment';
@Component({
  selector: 'mat-formio-time',
  template: `
      <mat-label *ngIf="instance">
          {{ instance.component.label }}
      </mat-label>
      <div style="margin-left: 1rem;" fxLayout="row" fxFlex="205px" fxLayoutGap="5%">
        <input [formControl]="hourControl" [step]="hourStep" [min]="0" [max]="12" type="number" fxFlex="30%" (input)="onChange()">
        <input [formControl]="minuteControl" [min]="0" [max]="59" [step]="minuteStep" type="number" fxFlex="30%" (input)="onChange()">
        <button fxFlex="15%" (click)="changePeriod()">{{period}}</button>
      </div>
        <mat-error *ngIf="instance">{{ instance.error.message }}</mat-error>
    <div class="help-block" *ngIf="instance">
        {{ instance.component.description  }}
    </div>
  `
})

export class MaterialTimeComponent extends MaterialComponent {
  public disabled: boolean = false;
  public period = 'AM';
  public hourControl: FormControl = new FormControl();
  public minuteControl: FormControl = new FormControl();
  @Output() selectedEvent = new EventEmitter<any>();
  @Input() hourStep = 1;
  @Input() minuteStep = 1;

  setDisabled(disabled) {
    disabled ? this.control.disable() : this.control.enable();
  }

  setInstance(instance) {
    super.setInstance(instance);
    this.control.setValue('00:00:00');
    this.onChange();
  }

  sendMessage() {
    if (this.instance) {
      this.onChange();
    }
    this.selectedEvent.emit(this.control)
  }

  onChange() {
    this.control.setValue(this.getTwentyFourHourTime(`${this.hourControl.value}:${this.minuteControl.value} ${this.period}`));
    if (this.instance) {
      super.onChange();
    }
    this.sendMessage();
  }

  setValue(value) {
    super.setValue(value);
    const controls = value.split(':');
    this.hourControl.setValue(controls[0]);
    this.minuteControl.setValue(controls[1]);
    this.period = controls[2];
  }

  getTwentyFourHourTime(amPmString) {
    const moment = moment_;
    return moment(amPmString, ['h:mm A']).format('HH:mm');
  }

  changePeriod() {
    this.period = this.period === 'AM' ? 'PM' : 'AM';
    this.onChange();
  }
}

TimeComponent.MaterialComponent = MaterialTimeComponent;
export { TimeComponent };
