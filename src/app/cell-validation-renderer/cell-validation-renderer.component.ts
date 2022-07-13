import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { faCoffee, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-cell-validation-renderer',
  template: ` <fa-icon [icon]="icon1"></fa-icon> `,
  styles: [
  ]
})
export class CellValidationRendererComponent implements ICellRendererAngularComp {

  public value: any;
  //icon ref
  public icon1 = faCoffee;
  public image: any;

  agInit(params: ICellRendererParams): void {
    // console.log("CellValidationRendererComponent.agInit called ") //debug
    // console.log("CellValidationRendererComponent.params ") //debug
    // console.log(params) //debug
    let validation_status_name = params?.colDef?.colId
    // console.log("validation_status_name")
    // console.log(validation_status_name)

    if (validation_status_name) {
      this.icon1 = params.data.validation[validation_status_name] === true ? faCheck : faXmark;
    } else {
      this.icon1 = faXmark;
    }

  }

  refresh(params: ICellRendererParams) {
    // console.log("CellValidationRendererComponent.refresh called ") //debug
    // console.log("CellValidationRendererComponent.refresh.params ") //debug
    // console.log(params) //debug
    let validation_status_name = params?.colDef?.colId
    // console.log("validation_status_name") //debug
    // console.log(validation_status_name) //debug

    if (validation_status_name) {
      this.icon1 = params.data.validation[validation_status_name] === true ? faCheck : faXmark;
    } else {
      this.icon1 = faXmark;
    }

    return true;
  }

}

