import { Component, OnInit } from '@angular/core';
import { ITooltipAngularComp } from 'ag-grid-angular';
import { ITooltipParams } from 'ag-grid-community';

@Component({
  selector: 'app-validation-custom-tooltip',
  template: `
        <div class="custom-tooltip"> 
        {{ validationFailedMsg }}
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
        transition: 0s;
      }

      :host.ag-tooltip-hiding {
        opacity: 0;
        transition: 0s;
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

  // public isFieldValid: boolean = true;
  // public field: string = "field";;
  // public lastValidation?: boolean;
  // public validationFailedMsg: string;
  public params!: { validationColumn: any, validationFailedMsg: string } & ITooltipParams;
  public validationFailedMsg!: string;
  public validationStatus!: boolean;



  agInit(params: { validationColumn: any, validationFailedMsg: string } & ITooltipParams): void {
    // let isFieldValid: boolean = true;
    console.log('ValidationCustomTooltipComponent called') //debug
    console.log('ValidationCustomTooltipComponent.params') //debug
    console.log(params) //debug

    // console.log('ValidationCustomTooltipComponent.params.validationFailedMsg') //debug
    // console.log(params.validationFailedMsg) //debug
    // let validationErrMsg = params.validationFailedMsg;


    this.validationFailedMsg = params.validationFailedMsg;
    this.validationStatus = params.data['validation'][params.validationColumn];

    console.log("params.validationColumn, this.validationFailedMsg, this.validationStatus ") //debug
    console.log(params.validationColumn, this.validationFailedMsg, this.validationStatus) //debug


    if (!this.validationStatus) {
      this.validationFailedMsg = params.validationFailedMsg;
    } else {
      this.validationFailedMsg = "Valid";
    }
    // this.field = "field";
    // this.lastValidation = true;
    // this.validationFailedMsg = "validation Message";
    // this.params = params;
    // let validation_status_name = params?.value.colDef?.colId
    // let isFieldValid = params.data['validation'][`validation_${validation_status_name}`] === true;
    // console.log('isFieldValid') //debug
    // console.log(isFieldValid) //debug
    // let validationFailedMsg = this.params['validationFailedMsg']? this.params['validationFailedMsg'] : '-Validation Message Missing-'

  }

  refresh() {
    console.log("ValidationCustomTooltipComponent refresh called")
  }
}


