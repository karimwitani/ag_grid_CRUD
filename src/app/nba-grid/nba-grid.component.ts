//packages
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ColumnApi, GridApi } from 'ag-grid-community';

//services
import { DataService } from '../data.service';

//components
import { ActionsButtonRendererComponent } from '../actions-button-renderer/actions-button-renderer.component'
import { MatDatePickerComponent } from '../mat-date-picker/mat-date-picker.component';

@Component({
  selector: 'app-nba-grid',
  templateUrl: './nba-grid.component.html',
  styles: [`
    .btn {
      width:30px;
      height:30px;
      margin:30px;
      font-size:10px;
      padding: 0px;
    }
  `]
})
export class NbaGridComponent implements OnInit, AfterViewInit {
  // gridApi and columnApi
  private api!: GridApi;
  private columnApi!: ColumnApi;
  rowData: any[] = [];
  columnDefs: any[] = [];
  gridData: any;
  gridCols: any;
  public rowSelection = 'multiple'

  // logical variables
  public editInProgress: boolean = false;
  public containerCoords= {};
  private editRowIndex: any = null;




  //grid options:
  gridOptions = {
    frameworkComponents: {
      matDatePicker: MatDatePickerComponent,
      actionButtonRenderer: ActionsButtonRendererComponent
    },
    rowSelection : 'multiple',
    editType: 'fullRow',
    suppressClickEdit: true,
  }


  @ViewChild('grid', { read: ElementRef }) public grid: any;


  constructor(private dataSvc: DataService, private http: HttpClient) { }


  ngOnInit(): void {
    // console.log('ngOnInit  called') //debug
    this.getGridNBAData()
      .then((nbaTeamArray: NBATeamInterace[]) => {
        this.columnDefs = [
          {
            headerName: "Actions",
            field: "actions",
            cellRenderer: multyActionCellRenderer,
          },
          {
            headerName: 'Name',
            field: 'name',
            editable: true,
            checkboxSelection: false,
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

  ngAfterViewInit() {
    this.updateContainerCoords();
    // console.log(`grid after ngAfterViewInit has been called: `); //debug
    // console.log(this.grid); //debug
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'my-auth-token'
    })
  };

  async getGridNBAData() {
    // console.log("getGridNBAData called: ") //debug

    var nbaData: any;
    await this.dataSvc.getNBAPromise().then(nbaTeamsArray => {
      nbaData = nbaTeamsArray;
    })
    // console.log(nbaData) //debug
    return nbaData;
  }

  onCellValueChanged(event: any) {
    // let editData: NBATeamInterace = event.data;
    // let id = editData.id;

    // console.log('onCellValueChanged called: data provided:')
    // console.log(editData)
    // console.log('typeof editData:')
    // console.log(typeof (editData))
    // console.log('editData.id:')
    // console.log(editData.id)

    // this.http.put(`http://localhost:5000/updateTeam/${id}`, editData, this.httpOptions).subscribe(response => {
    //   console.log(`put request return`);
    //   console.log(response);
    // });
  }

  deleteSelectedRows() {
    var idsToDelete: any[] = []
    const selectRows = this.api.getSelectedRows();
    selectRows.forEach(row => {
      console.log(row.id); // debug
      idsToDelete.push(row.id);

    })
    console.log(idsToDelete) // debug
    this.http.delete('http://localhost:5000/deleteTeam', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'my-auth-token'
      }),
      body: idsToDelete
    }).subscribe(response => {
      console.log(`delete request return`);
      console.log(response);
    });

    this.api.updateRowData({ remove: selectRows });

  }

  rowsSelected() {
    return false
  }

  onGridReady(params: any): void {
    this.api = params.api;
    this.columnApi = params.columnApi;
    this.columnApi.autoSizeAllColumns();

    //this.api.sizeColumnsToFit();

  }

  public updateContainerCoords() {
    this.containerCoords = {
      top: this.grid.nativeElement.offsetTop,
      left: this.grid.nativeElement.offsetLeft,
      height: this.grid.nativeElement.offsetHeight,
      width: this.grid.nativeElement.offsetWidth
    };
    // console.log('updateContainerCoords'); //debug
    // console.log(this.containerCoords); //debug
  }

  insertNewRow() {
    // console.log('insertNewRow called') // debug
    // console.log(this.containerCoords) // debug
    this.updateContainerCoords();
    this.editInProgress = true;
    // console.log(this.editInProgress)
  }

  cancelEditScreen() {
    // console.log('cancelEditScreen called') //debug
    // console.log('event:') //debug
    // console.log($event) //debug
    this.editInProgress = false;
  }

  onCellClicked(params: any) {
    // Handle click event for action cells
    console.log('onCellClicked called')//debug
    // console.log('onCellClicked: params')//debug
    // console.log(params) //debug


    if (params.column.colId === "actions" && params.event.target.dataset.action) {
      let action = params.event.target.dataset.action;


      if (action === "edit") {
        console.log('onCellClicked: edit: params.columnApi.getDisplayedCenterColumns()[0].colId')//debug
        console.log(params.columnApi.getDisplayedCenterColumns()[0].colId) //debug

        this.onRowEditingStarted(params);
        this.editInProgress = true;
        this.editRowIndex = params.rowIndex;
      }

      if (action === "delete") {
        params.api.applyTransaction({
          remove: [params.node.data]
        });
        this.editInProgress = false;
      }

      if (action === "update") {
        params.api.stopEditing(false);
        this.editInProgress = false;
      }

      if (action === "cancel") {
        console.log('action clicked is cancel')
        params.api.stopEditing(true);
        this.editInProgress = false;
      }
    } else if (this.editInProgress === true) {

      if (this.editRowIndex != params.rowIndex) {
        console.log('inside else if loop')
        console.log("this.editRowIndex") //debug
        console.log(this.editRowIndex)//debug
        console.log("params.rowIndex")//debug
        console.log(params.rowIndex)//debug

        params.api.stopEditing(true);
        this.editInProgress = false;
        this.onRowEditingStopped(params);
      }
    }
    console.log(this.editInProgress) //debug
  }

  onRowEditingStarted(params: any) {
    // console.log('onRowEditingStarted called') //debug
    // console.log('onRowEditingStarted.params: ') //debug
    // console.log(params) //debug

    this.editRowIndex = params.node.rowIndex
    params.api.startEditingCell({
      rowIndex: this.editRowIndex,
      // gets the first columnKey
      colKey: params.columnApi.getDisplayedCenterColumns()[1].colId
    });

    let nodes: any[] = [];
    params.api.forEachNode((node: any) => {
      nodes.push(node)
    })
    // console.log(nodes) //debug 
    params.api.refreshCells({
      columns: this.columnApi.getAllColumns(),
      rowNodes: nodes,
      force: true
    });
  }

  onRowEditingStopped(params: any) {
    if (this.editInProgress) {
      console.log('inside onRowEditingStopped but skipping execution')
      params.api.stopEditing(true);
    } else {
      console.log('onRowEditingStopped called') //debug
      // console.log('onRowEditingStopped.params: ') //debug
      console.log(params) //debug

      let nodes: any[] = [];
      params.api.forEachNode((node: any) => {
        nodes.push(node)
      })
      params.api.refreshCells({
        columns: this.columnApi.getAllColumns(),
        rowNodes: nodes,
        force: true
      });
      this.editRowIndex = null;
    }
  }

}




interface NBATeamInterace {
  abbreviation: string,
  city: string,
  conference: string,
  division: string,
  full_name: string,
  id: number
  name: string
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







