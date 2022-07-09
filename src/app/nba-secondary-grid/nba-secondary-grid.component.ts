//packages
import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ColumnApi, GridApi, RowClassRules } from 'ag-grid-community';

//services
import { DataService } from '../data.service';

//components
import { ActionsButtonRendererComponent } from '../actions-button-renderer/actions-button-renderer.component'
import { MatDatePickerComponent } from '../mat-date-picker/mat-date-picker.component';

@Component({
  selector: 'app-nba-secondary-grid',
  templateUrl: './nba-secondary-grid.component.html',
  styles: [`
    .action-button {
      width:15%;
      float:right;
      margin:10px;
    }


  `]
})
export class NbaSecondaryGridComponent implements OnInit, OnChanges {
  // gridApi and columnApi
  private api: GridApi;
  private columnApi: ColumnApi;
  rowData: any[] = [];
  columnDefs: any[] = [];
  rowSelection = 'multiple'


  // logical variables
  public inputPresentAndValide:boolean = false;

  //I/O
  @Output() cancelEdits:EventEmitter<Object> =new EventEmitter<Object>(); 
  @Input() rowsToEdit: any;

  //grid options:
  gridOptions = {
    frameworkComponents: {
      matDatePicker: MatDatePickerComponent,
      actionButtonRenderer: ActionsButtonRendererComponent
    },
    enableCellChangeFlash: true,
    defaultColDef: {
      resizable: true,
      
    },
    getRowStyle: function (params: any) {
      if (params.data.action == 'edit') {
        return { background: '#b7ed9d' };
      } else if (params.data.action == 'delete') {
        return { background: '#f5bcb0' };
      } else {
        return { background: '#cff5b0' };
      }
    }
  }

  constructor(private dataSvc: DataService, private http: HttpClient) { }
  
  onGridReady(params: any): void {
    // console.log("onGridReady called") //debug
    this.api = params.api;
    this.columnApi = params.columnApi;
    this.api.sizeColumnsToFit();
  }


  ngOnChanges(changes: SimpleChanges) {
    // console.log("ngOnChanges called") //debug
    for (let property in changes) {

      // console.log("ngOnChanges.changes") //debug
      // console.log(changes) //debug

      // console.log("this.api") //debug
      // console.log(this.api) //debug

      this.rowData = changes['rowsToEdit']['currentValue'];
      if (this.api !== undefined) {
        this.api.refreshCells({
          force: true
        });
      }

    }
  }



  ngOnInit(): void {
    // console.log('ngOnInit  called') //debug
    this.columnDefs = [
      {
        headerName: "Action",
        field: "action",
        checkboxSelection: true,
      },
      {
        headerName: 'Name',
        field: 'name',
        editable: true,
        filter: 'agDateColumnFilter',
      },
      {
        headerName: 'Full Name',
        field: 'full_name',
        editable: true,
      },
      {
        headerName: 'Abreviation',
        field: 'abbreviation',
        editable: true,
      },
      {
        headerName: 'City',
        field: 'city',
        editable: true,
      },
      {
        headerName: 'Conference',
        field: 'conference',
        editable: true,
      },
      {
        headerName: 'Division',
        field: 'division',
        editable: true,

      },
      {
        headerName: 'Date Founded',
        field: 'date_founded',
        editable: true,
        cellEditor: 'matDatePicker',
      },
    ]
  }

  addEditRow($event: any) {
    // console.log("addEditRow called within secondary grid") //debug 
    // console.log($event) //debug 
    this.api.applyTransaction(
      {
        add: [{ action: 'insert' }],
        addIndex: 0,
      }
    );
    this.api.startEditingCell({
      rowIndex: 0,
      colKey: 'name'
    });
  }

  commitChange() {
    this.http.post(`http://localhost:5000/`, this.rowData, this.dataSvc.httpOptions).subscribe(response => {
      console.log(`post request return`); //debug
      console.log(response); //debug
    });
    window.location.reload()
  }

  removeSelected($event: any) {
    // console.log('removeSelected called') //debug


    var idsToDelete: any[] = []
    var selectRows = this.api.getSelectedRows();

    // console.log('removeSelected.selectRows') //debug
    // console.log(selectRows) //debug

    selectRows.forEach(row => {
      // console.log(row.id); // debug
      idsToDelete.push(row.id);

    })
    // console.log("idsToDelete") // debug
    // console.log(idsToDelete) // debug





    // console.log("this.rowData before refresh") //debug
    // console.log(this.rowData) //debug

    //to keep, apply transaction removes from view but doesn't affect the rowdata
    this.api.applyTransaction({ remove: selectRows });


    this.rowData = this.rowData.filter(function (ele) {
      return !idsToDelete.includes(ele.id);
    });



    // for (var row of selectRows) {
    //   let rowIndex: any = row.rowIndex;
    //   this.rowData.splice(rowIndex, 1)
    // }


    // console.log("this.rowData after refresh") //debug
    // console.log(this.rowData) //debug


    this.api.redrawRows()
    // this.api.refreshCells({
    //   force: true
    // });

    this.cancelEdits.emit(selectRows);
  }


  // getSelectedRows() {
  //   let selectedRows = this.api.getSelectedNodes()
  //   console.log("selectedRows:") //debug
  //   console.log(selectedRows) //debug
  // }

}








