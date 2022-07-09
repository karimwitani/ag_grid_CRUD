import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-actions-button-renderer',
  template: `
  <span style="display: block; width: 100%; display:inline-block;" >
    <button class="btn btn-primary edit-btn" type="button" (click)="onEditClick($event)" [display]="editMode">Edit</button>
    <button class="btn btn-danger edit-btn" type="button" (click)="onDeleteClick($event)" [display]="editMode">Delete</button>
  </span>
  `,
  styles: [`
    .edit-btn {
      width:50px;
      height:30px;
      margin:5px;
      font-size:10px;
      padding: 0px;
    }
  `]
})
export class ActionsButtonRendererComponent implements ICellRendererAngularComp {
  params: any;
  label: string;
  editMode: boolean = true;

  agInit(params: any): void {
    // TODO : PRINT OUT THE PARAMS PASSED FROM THE PARENT AT INIT
    this.params = params;
    this.label = this.params.label || null;
  }

  refresh(params?: any): boolean {
    return true;
  }

  onEditClick($event: any) {
    console.log('onEditClick called') // debug
    console.log('onEditClick, this.params:') // debug
    console.log(this.params) // debug
    this.params.api.startEditingCell({
      rowIndex: this.params.rowIndex,
      colKey: 'name'
    });
    if (this.params.onClick instanceof Function) {
      // put anything into params u want pass into parents component

      const params = {
        event: $event,
        rowData: this.params.node.data

        // ...something
      }
      this.params.onClick(this.params);

    }
  }

  onDeleteClick($event: any) {
    console.log('onDeleteClick called') // debug
    console.log('onDeleteClick, this.params:') // debug
    console.log(this.params) // debug
    console.log('onDeleteClick, $event:') // debug
    console.log($event) // debug
  }



}
