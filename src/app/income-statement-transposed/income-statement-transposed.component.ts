import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ColDef } from 'ag-grid-community';




@Component({
  selector: 'app-income-statement-transposed',
  templateUrl: './income-statement-transposed.component.html',
  styles: [
  ]
})
export class IncomeStatementTransposedComponent {

  IC_APPL_TRANSPOSED =[{
    "field":"revenue",
    "2021-09-25":365817000000,
    "2020-09-26":274515000000
  },
  {
    "field":"grossProfit",
    "2021-09-25":152836000000,
    "2020-09-26":104956000000
  }];

    rowData = this.IC_APPL_TRANSPOSED;
    columnDefs = [
      {
        headerName: "Income Statement",
        field: "field"
      },
      {
        headerName: "2021",
        field: "2021-09-25"
      },
      {
        headerName: "2020",
        field: "2020-09-26"
      }]
}

