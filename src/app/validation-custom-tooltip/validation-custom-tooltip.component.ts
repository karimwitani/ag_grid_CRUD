import { Component, OnInit } from '@angular/core';
import { ITooltipAngularComp } from 'ag-grid-angular';
import { ITooltipParams } from 'ag-grid-community';

@Component({
  selector: 'app-validation-custom-tooltip',
  template: `
        <div class="validation-msg"> 
          FIELD-{{field.toUpperCase()}}- invalid value:  
          "<span class="invalid-value"> {{lastValidation}} </span>", 
          {{validationFailedMsg}}
        </div> 
    `,
  styles: [
    `
      :host {
        position: absolute;
        width: 150px;
        height: 70px;
        border: 1px solid cornflowerblue;
        overflow: hidden;
        pointer-events: none;
        transition: opacity 1s;
      }

      :host.ag-tooltip-hiding {
        opacity: 0;
      }

      .custom-tooltip p {
        margin: 5px;
        white-space: nowrap;
      }

      .custom-tooltip p:first-of-type {
        font-weight: bold;
      }
    `,
  ]
})
export class ValidationCustomTooltipComponent implements ITooltipAngularComp {

  public field: string = "";
  public lastValidation: boolean = true;
  public validationFailedMsg: string = "placeholder validation fail mesage";
  private params!: ITooltipParams;

  agInit(params: ITooltipParams): void {
    console.log('ValidationCustomTooltipComponent called') //debug
    console.log('ValidationCustomTooltipComponent.params') //debug
    console.log(params) //debug
    this.params = params;
    let validation_status_name = params?.value.colDef?.colId
    let isFieldValid = params.data['validation'][`validation_${validation_status_name}`] === true;
    console.log('isFieldValid') //debug
    console.log(isFieldValid) //debug

    if (!isFieldValid) {
      this.field = validation_status_name
      this.lastValidation = params.data['validation'][`validation_${this.field}`],
        this.validationFailedMsg
    };
  }
}


