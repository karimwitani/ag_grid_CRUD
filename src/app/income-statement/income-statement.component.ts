import { Component, Input, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { DataService } from '../data.service';

@Component({
  selector: 'app-income-statement',
  templateUrl: './income-statement.component.html'
})
export class IncomeStatementComponent {
  columnDefs;
  rowData;


  constructor(dataSvc: DataService) {
    this.rowData = dataSvc.getData();
    this.columnDefs = [
      {
        headerName: 'Date',
        field: 'date'
      },
      {
        headerName: 'Revenue',
        field: 'revenue'
      },
      {
        headerName: 'Gross Profit',
        field: 'grossProfit'
      }
    ]
   }

  ngOnInit(): void {
  }


}
