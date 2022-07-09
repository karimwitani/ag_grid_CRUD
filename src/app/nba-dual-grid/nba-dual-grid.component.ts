//packages
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ColumnApi, GridApi } from 'ag-grid-community';

//services
import { DataService } from '../data.service';

//components
import { ActionsButtonRendererComponent } from '../actions-button-renderer/actions-button-renderer.component'
import { MatDatePickerComponent } from '../mat-date-picker/mat-date-picker.component';

@Component({
  selector: 'app-nba-dual-grid',
  templateUrl: './nba-dual-grid.component.html',
  styles: [
  ]
})
export class NbaDualGridComponent implements OnInit {
  // gridApi and columnApi
  private api: GridApi;
  private columnApi: ColumnApi;
  rowData: any[] = [];
  columnDefs: any[] = [];
  gridData: any;
  gridCols: any;
  rowsToEdit: any[] = [];
  originalRowCache: any[] = [];
  rowSelection = 'multiple'

  // logical variables
  public editInProgress: boolean = true;

  // I/O
  @Output() rowSentForEditing = new EventEmitter<any>();

  //grid options:
  gridOptions = {
    frameworkComponents: {
      matDatePicker: MatDatePickerComponent,
      actionButtonRenderer: ActionsButtonRendererComponent
    },
    suppressClickEdit: true,
    defaultColDef: {
      resizable: true,
      filter: true,
    },
  }

  //filter params




  constructor(private dataSvc: DataService, private http: HttpClient) { }

  ngOnInit(): void {
    // console.log('ngOnInit  called') //debug
    this.getGridNBAData()
      .then((nbaTeamArray: any[]) => {
        this.columnDefs = [
          {
            headerName: "Actions",
            field: "actions",
            cellRenderer: multyActionCellRenderer,
          },
          {
            headerName: 'Name',
            field: 'name',
            filterParams: filterParams,

          },
          {
            headerName: 'Full Name',
            field: 'full_name',
            filterParams: filterParams,
          },
          {
            headerName: 'Abreviation',
            field: 'abbreviation',
            filterParams: filterParams,
          },
          {
            headerName: 'City',
            field: 'city',
            filterParams: filterParams,
          },
          {
            headerName: 'Conference',
            field: 'conference',
            filterParams: filterParams,
          },
          {
            headerName: 'Division',
            field: 'division',
            filterParams: filterParams,

          },
          {
            headerName: 'Date Founded',
            field: 'date_founded',
            filterParams: filterParams,
            filter: 'agDateColumnFilter',
          },
        ]

        // console.log(nbaTeamArray); //debug
        nbaTeamArray.forEach(teamFromArray => {
          // console.log(teamFromArray); // debug
          this.rowData.push(teamFromArray);
        })
        // console.log(this.rowData) //debug
      })
      .then(() => {
        this.gridData = this.rowData
        this.gridCols = this.columnDefs
      })
  }

  async getGridNBAData() {
    // console.log("getGridNBAData called: ") //debug

    var nbaData: any;
    await this.dataSvc.getNBAPromise().then(nbaTeamsArray => {
      nbaData = nbaTeamsArray;
    })
    // console.log(nbaData) //debug
    return nbaData;
  }

  onGridReady(params: any): void {
    this.api = params.api;
    this.columnApi = params.columnApi;
    this.columnApi.autoSizeAllColumns();
  }

  onCellClicked(params: any) {
    // console.log('onCellClicked called')//debug

    if (params.column.colId === "actions" && params.event.target.dataset.action) {
      let action = params.event.target.dataset.action;
      if (["edit", "delete"].includes(action)) {
        // console.log(`action === ${action}`)//debug
        // console.log('onCellClicked.params:')//debug

        var selectRows = this.api.getSelectedRows();
        this.api.applyTransaction({ remove: selectRows });
        this.rowData = this.rowData.filter(function (ele) {
          return ele.id !== params.data.id
        });

        // console.log("this.rowData after filtering out the element sent downstream") //debug
        // console.log(this.rowData) //debug

        if (this.rowsToEdit.filter(e => e.id == params.data.id).length == 0) {
          //add rows to a cache in case you want the edit to be canceled and rows transfered back to primary grid
          this.originalRowCache = [params.data, ...this.rowsToEdit];

          //edit the params.data to include the action
          params.data['action'] = action;
          // console.log(params)//debug

          //add edited row to list of rows in secondary grid
          this.rowsToEdit = [params.data, ...this.rowsToEdit];


          //show all rows in rowToEdit
          // console.log(this.rowsToEdit)//debug
          // //show all rows in originalRowCache
          // console.log(this.originalRowCache)//debug


        }
      }
    }
  }

  onCancelEdits(rowsFromCancelEvent: any) {
    // console.log("editCancel called")//debug
    // console.log(rowsFromCancelEvent)//debug

    let rowIdsFromCancelEvent: any[] = [];
    let rowsToReinsertFromCancelEvent: any[] = [];
    for (let row of rowsFromCancelEvent) {
      if (row.hasOwnProperty('id')) {
        rowIdsFromCancelEvent.push(row.id);
        rowsToReinsertFromCancelEvent.push(row);
        this.api.applyTransaction({
          add: [row],
          addIndex: 0
        })
      }

    }

    // console.log('primary grid received these rows:'); //debug
    // console.log(rowIdsFromCancelEvent);

    this.rowsToEdit = this.rowsToEdit.filter(function (ele) {
      return !rowIdsFromCancelEvent.includes(ele.id);
    })

    this.rowData.push([...rowsToReinsertFromCancelEvent])

    this.api.refreshCells({
      force: true
    });
  }

}

function multyActionCellRenderer(params: any) {
  // console.log('multyActionCellRenderer called') //debug
  let eGui = document.createElement("div");


  let editingCells = params.api.getEditingCells();
  // console.log('multyActionCellRenderer :editingCells') //debug
  // console.log(editingCells) //debug


  let isCurrentRowEditing = editingCells.some((cell: any) => {
    // console.log('cell') //debug
    // console.log(cell) //debug
    // console.log('cell.rowIndex') //debug
    // console.log(cell.rowIndex) //debug
    // console.log('params.node.rowIndex') //debug
    // console.log(params.node.rowIndex) //debug
    return cell.rowIndex === params.node.rowIndex;
  });
  // console.log('multyActionCellRenderer :isCurrentRowEditing') //debug
  // console.log(isCurrentRowEditing) //debug

  if (isCurrentRowEditing) {
    eGui.innerHTML = `
    <button  class="btn edit-btn action-button btn-success" style="width:50%;" data-action="update"> update  </button>
    <button  class="btn edit-btn action-button btn-secondary"  style="width:50%;"data-action="cancel" > cancel </button>
  `;
  } else {
    eGui.innerHTML = `
    <div class"edit-btn">
      <button class="btn btn-primary action-button"  style="width:50%;"data-action="edit" > edit  </button>
      <button class="btn btn-danger action-button" style="width:50%;"data-action="delete" > delete </button>
    </div>
  `;
  }

  return eGui;
}


var filterParams = {
  buttons: ['apply','reset'],
  closeOnApply:true
}