import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-drop-down-renderer',
  template: `
    <span
      [style.borderLeft]="'10px solid ' + params.value"
      [style.paddingLeft]="'5px'"
      >{{ params.value }}</span
    >
  `,
  styles: [
  ]
})
export class DropDownRendererComponent implements ICellRendererAngularComp {

  public params!: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh() {
    return false;
  }

}
