//packages
import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ColumnApi, GridApi, ValueGetterParams, ValueSetterParams, ITooltipParams } from 'ag-grid-community';


//services
import { DataService } from '../data.service';

//components
import { ActionsButtonRendererComponent } from '../actions-button-renderer/actions-button-renderer.component'
import { MatDatePickerComponent } from '../mat-date-picker/mat-date-picker.component';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { CellValidationRendererComponent } from '../cell-validation-renderer/cell-validation-renderer.component'
import { ValidationCustomTooltipComponent } from '../validation-custom-tooltip/validation-custom-tooltip.component'

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
export class NbaSecondaryGridComponent implements OnInit, OnChanges, OnDestroy {
  // gridApi and columnApi
  private api: GridApi;
  private columnApi: ColumnApi;
  rowData: any[] = [];
  columnDefs: any[] = [];
  rowSelection = 'multiple'


  // logical variables
  public inputPresentAndValide: boolean = false;

  //I/O
  @Output() cancelEdits: EventEmitter<Object> = new EventEmitter<Object>();
  @Input() rowsToEdit: any;

  //icon ref
  faCoffee = faCoffee;

  //variables
  public tooltipShowDelay = 0;
  public tooltipHideDelay = 2000

  //grid options:
  gridOptions = {
    frameworkComponents: {
      matDatePicker: MatDatePickerComponent,
      actionButtonRenderer: ActionsButtonRendererComponent
    },
    enableCellChangeFlash: true,
    defaultColDef: {
      resizable: true,
      tooltip: ValidationCustomTooltipComponent

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
    console.log("ngOnChanges called") //debug
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
      this.inputPresentAndValide = this.rowData.length > 0 ? false : true;
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
      this.createValidationStatusColumn("name", "Name should be less than 10 characters"),
      this.createColumnDef("name", "Name", this.tenCharacterValidator, this.stringParser),
      this.createValidationStatusColumn("full_name", "Name should be less than 10 characters"),
      this.createColumnDef("full_name", "Full Name", this.tenCharacterValidator, this.stringParser),
      this.createValidationStatusColumn("abbreviation", "Name should be less than 10 characters"),
      this.createColumnDef("abbreviation", "Abreviation", this.tenCharacterValidator, this.stringParser),
      {
        headerName: 'City',
        field: 'city',
        editable: true,
        valueGetter: (params: ValueGetterParams) => {
          return params.data.city;
        },
        valueSetter: (params: ValueSetterParams) => {
          var city = params.newValue;
          if (city.length < 15) {
            params.data.city = city
            return true
          }
          else {
            return false
          }
        }
      },
      {
        headerName: 'Conference',
        field: 'conference',
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: ['East', 'West'],
        }
      },
      {
        headerName: 'Division',
        field: 'division',
        editable: true,
        valueGetter: (params: ValueGetterParams) => {
          return params.data.division;
        },
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: ['Atlantic', 'Central', 'Northeast', 'Northwest', 'Pacific', 'Southeast'],
        }

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
    console.log("addEditRow called within secondary grid") //debug 
    console.log($event) //debug 
    let newRow = { action: 'insert', lastValidation: true }
    this.api.applyTransaction(
      {
        add: [newRow],
        addIndex: 0,
      }
    );
    this.api.startEditingCell({
      rowIndex: 0,
      colKey: 'name'
    });
    this.rowData.push(newRow)
    console.log(this.rowData)
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

  createColumnDef(field: string, headerName: string, validationFn: any, valueParser: any) {
    console.log("createColumnDef called") //debug
    return {
      headerName: headerName,
      field: field,

      valueGetter: (params: any) => params.data[field] ? params.data[field] : "",
      valueSetter: this.syncValidateValueSetter(validationFn),
      editable: true,
      valueParser: valueParser,
      // tooltipComponent: ValidationCustomTooltipComponent,
      // tooltipValueGetter: toolTipValueGetter,
    };
  }

  // _valueGetter(params:any,field:any){
  //   console.log("_valueGetter called")
  //   console.log("_valueGetter.params")
  //   console.log(params)
  //   return params.data[field] ? params.data[field] : "";
  // }

  createValidationStatusColumn(field: any, validationFailedMsg = "", headerName = "") {
    console.log("createValidationStatusColumn called") //debug


    return {
      colId: `validation_${field}`,
      valueGetter: (params: any) => {
        // console.log("createValidationStatusColumn.params") //debug
        // console.log(params) //debug
        // console.log("field") //debug
        // console.log(field) //debug
        params.data[field]
      },
      headerName,
      width: 10,
      type: 'leftAligned',
      cellRenderer: CellValidationRendererComponent,
      suppressMenu: true,
      minWidth: 25,
      tooltipComponent: ValidationCustomTooltipComponent,
      tooltipValueGetter: toolTipValueGetter,
      // (params: ITooltipParams) => {
      //   console.log('tooltipValueGetter called') //debug
      //   console.log('tooltipValueGetter.params') //debug
      //   console.log(params) //debug
      //   let isFieldValid = params.data['validation'][`validation_${field}`] === true;
      //   console.log('isFieldValid') //debug
      //   console.log(isFieldValid) //debug

      //   if (isFieldValid) {
      //     return "";
      //   } else {
      //     return {
      //       field,
      //       lastValidation: params.data['validation'][`validation_${field}`],
      //       validationFailedMsg
      //     };
      //   }

      // }
    };
  }

  syncValidateValueSetter = (validateFn: any) => (params: any) => {
    // console.log("syncValidateValueSetter called") //debug
    // console.log("syncValidateValueSetter.params") //debug
    // console.log(params) //debug
    // Side Effect that handles validation and updating the grid
    this.syncValidator(
      params.newValue,
      validateFn,
      this._onSuccess(params, params.newValue),
      this._onFail(params)
    );

    return true;
  };

  syncValidator = (newValue: any, validateFn: any, onSuccess: any, onFail: any) => {
    // console.log("syncValidator called") //debug
    // console.log("syncValidator.newValue") //debug
    // console.log(newValue) //debug
    // console.log("syncValidator.validateFn") //debug
    // console.log(validateFn) //debug
    // console.log("syncValidator.onSuccess") //debug
    // console.log(onSuccess) //debug
    // console.log("syncValidator.onFail") //debug
    // console.log(onFail) //debug
    // console.log("validateFn(newValue)") //debug
    // console.log(validateFn(newValue)) //debug

    if (validateFn(newValue) == true) {
      onSuccess();
    } else {
      onFail();
    }
  };

  _onSuccess = (params: any, newValue: any) => () => {
    // console.log("_onSuccess called") //debug
    // console.log("_onSuccess.params") //debug
    // console.log(params) //debug
    // console.log("_onSuccess.newValue") //debug
    // console.log(newValue) //debug

    let field = params.colDef.field;
    params.data[field] = params.newValue
    params.data['validation'][`validation_${field}`] = true

    params.api.applyTransaction({ update: [params.data] });
    this.api.refreshCells({
      force: true
    })

    // console.log("_onSuccess.params") //debug
    // console.log(params) //debug
    // console.log("this.rowData") //debug
    // console.log(this.rowData) //debug
  };

  _onFail = (params: any) => () => {
    // console.log("_onFail called") //debug
    // console.log("_onFail.params") //debug
    // console.log(params) //debug
    let field = params.colDef.field;

    params.data[field] = params.newValue
    params.data['validation'][`validation_${field}`] = false
    params.api.applyTransaction({ update: [params.data] });
    this.api.refreshCells({
      force: true
    })
  };

  numberParser(params: any) {
    // console.log("numberParser called") //debug
    // console.log("numberParser.params") //debug
    // console.log(params) //debug
    // console.log("Number(params.newValue)") //debug
    // console.log(Number(params.newValue)) //debug
    return Number(params.newValue)
  }

  stringParser(params: any) {
    // console.log("stringParser called") //debug
    // console.log("stringParser.params") //debug
    // console.log(params) //debug
    // console.log("params.toString()") //debug
    // console.log(params.newValue.toString()) //debug
    return params.newValue.toString()
  }

  isGreaterThanFive(params: any) {
    // console.log("isGreaterThanFive called") //debug
    // console.log("isGreaterThanFive.params") //debug
    // console.log(params) //debug
    // console.log("params > 5") //debug
    // console.log(params > 5) //debug
    return params > 5;
  }

  tenCharacterValidator(params: any) {
    // console.log("stringLengthValidator called") //debug
    // console.log("stringLengthValidator.params") //debug
    // console.log(params) //debug
    // console.log(`string.length =< 10`) //debug
    // console.log(params.length <= 10) //debug
    return params.length <= 10;
  }

  ngOnDestroy() {
    // console.log("ngOnDestroy called")
    // console.log("ngOnDestroy called again")
    this.api.destroy();
  }


}


class CustomTooltip {
  eGui: HTMLDivElement;
  init(params: any) {
    console.log("CustomTooltip called") //debug
    console.log("CustomTooltip.params") //debug
    console.log(params) //debug
    this.eGui = document.createElement("div");
    this.eGui.classList.add("custom-tooltip");

    let { field, lastValidation, validationFailedMsg } = params.value;

    this.eGui.innerHTML = `
        <div class="validation-msg"> 
          FIELD-${field.toUpperCase()} - invalid value:  
          "<span class="invalid-value"> ${lastValidation} </span>", 
          ${validationFailedMsg}
        </div> 
    `;
  }
  getGui() {
    return this.eGui;
  }
}


const toolTipValueGetter = (params: ITooltipParams) => ({
  value: params,
});