//packages
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ColDef, ColumnApi, GridApi } from 'ag-grid-community';

// services
import { DataService } from '../data.service';

//data modesl
import { Team } from '../model/team';

//components
import { MatDatePickerComponent } from '../mat-date-picker/mat-date-picker.component';




@Component({
  selector: 'app-athlete-edit-screen',
  templateUrl: './athlete-edit-screen.component.html',
  styles: [`
    .input-panel {
      
    }`
  ]
})
export class AthleteEditScreenComponent implements OnInit {
  // gridApi and columnApi
  private api: GridApi;
  private columnApi: ColumnApi;

  // interim/form data
  public name: string;
  public cities: string[] = [];
  public conferences: string[] = [];
  public divisions: string[] = [];
  public popupParent: any;


  //grid data and column definitions
  public rowData: Team[] = [];
  public columnDefs: ColDef[] = []

  //coordinates for panel sizing
  public width: any;
  public left: any;
  public top: any;
  public height: any;

  //grid options
  gridOptions = {
    defaultColDef: {
      sortable: true,


    },
    popupParent: document.querySelector('body')!,
    context: {
      componentParent: this,
    },
  }


  @Input() containerCoords: any = null;
  @Input() editInProgress: boolean;
  @Output() onEditCancel = new EventEmitter<boolean>();




  // to position this component relative to the containing component
  @ViewChild('panel', { read: ElementRef }) panel: any;

  frameworkComponents: Object;

  constructor(private dataSvc: DataService, private cdRef: ChangeDetectorRef, private http: HttpClient) {
    this.name = 'city';
    this.frameworkComponents = { matDatePicker: MatDatePickerComponent };
  }

  ngOnInit() {
    Promise.all([this.getCitiesData(), this.getConferencesData(), this.getDivisionsData()])
      .then(fulfilledPromisedata => {
        console.log('values from promise.all') //debug
        console.log(fulfilledPromisedata) //debug
        this.cities = fulfilledPromisedata[0]
        this.conferences = fulfilledPromisedata[1]
        this.divisions = fulfilledPromisedata[2]
      })
      .then(
        () => {
          this.columnDefs = [{
            headerName: 'Name',
            field: 'name',
            editable: true,
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
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {

              values: this.cities,
            }
          },
          {
            headerName: 'Conference',
            field: 'conference',
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {

              values: this.conferences,
            }
          },
          {
            headerName: 'Division',
            field: 'division',
            editable: true,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {

              values: this.divisions,
            }
          },
          {
            headerName: 'Date Founded',
            field: 'date_founded',
            editable: true,
            cellEditor: 'matDatePicker',
          },]
        })

    // console.log('containerCoords receved into athlete edit screen : ') //debug
    // console.log(this.containerCoords); // debug

  }

  ngAfterViewInit() {
    // this.width = this.containerCoords.width;
    // this.left = this.containerCoords.left;
    // this.top = this.containerCoords.top;
    // console.log(`panel after ngAfterViewInit has been called: `); //debug
    // console.log(this.panel); //debug
    this.setPanelCoordinates();


    this.cdRef.detectChanges();

  }

  async getCitiesData() {
    // console.log('getCitiesData called  ') //debug

    var citiesFromPromise: string[] = [];
    await this.dataSvc.getCitiesPromise().then(cities => {
      citiesFromPromise = cities;
      // console.log('citiesFromPromise:') //debug
      // console.log(citiesFromPromise) //debug

    })
    return citiesFromPromise;
  }

  async getConferencesData() {
    // console.log('getConferneceData called  ') //debug

    var conferencesFromPromise: string[] = [];
    await this.dataSvc.getConferencePromise().then(conferences => {
      conferencesFromPromise = conferences;
      // console.log('conferencesFromPromise:') //debug
      // console.log(conferencesFromPromise) //debug

    })
    return conferencesFromPromise;
  }

  async getDivisionsData() {
    // console.log('getConferneceData called  ') //debug

    var divisionsFromPromise: string[] = [];
    await this.dataSvc.getDivisionPromise().then(divisions => {
      divisionsFromPromise = divisions;
      // console.log('divisionsFromPromise:') //debug
      // console.log(divisionsFromPromise) //debug

    })
    return divisionsFromPromise;
  }

  insertNewResult() {
    // insert a blank new row, providing the first sport as a default in the sport column
    this.api.applyTransaction(
      {
        add: [{}]
      }
    );
    this.api.startEditingCell({
      rowIndex: 0,
      colKey: 'name'
    });

  }

  cancelInsert() {
    // console.log('cancelInsert called ') //debug

    this.editInProgress = false;
    // console.log('edit screen this.editInProgress: ') //debug
    // console.log(this.editInProgress) //debug

    this.onEditCancel.emit(this.editInProgress);
    // console.log('this.onEditCancel.emit called ') //debug
    // console.log('this.onEditCancel.emit(this.editInProgress): ') //debug


  }

  onRowValueChanged(params: any) {

  }

  saveTeam() {
    console.log("saveTeam called ") // debug
    let rowData: any[] = [];
    this.api.forEachNode(node => rowData.push(node.data));
    console.log("row data from edit athlete screen ") // debug
    console.log(rowData) // debug

    this.http.post(`http://localhost:5000/insertTeams`, rowData, this.dataSvc.httpOptions).subscribe(response => {
      console.log(`post request return`); //debug
      console.log(response); //debug
    });

    this.api.setRowData([]);
  }

  isValidTeam() {
    return true;
  }

  onGridReady(params: any): void {
    this.api = params.api;
    this.columnApi = params.columnApi;

    

    // temp fix until AG-1181 is fixed
    // this.api.hideOverlay();


  }

  private setPanelCoordinates() {

    // make our width 100pixels smaller than the container
    // this.width = (this.containerCoords.width - 100);

    // set our left position to be the container left position plus half the difference in widths between this
    // component and the container, minus the 15px padding
    this.left = Math.floor(this.containerCoords.left + (this.containerCoords.width - this.width) / 2 - 15) + 'px';

    // set our left position to be the container top position plus half the difference in height between this
    // component and the container
    // this.top = Math.floor(this.containerCoords.top + (this.containerCoords.height - this.panel.nativeElement.offsetHeight) / 2) + 'px';

    // add the px suffix back in (omitted above so that maths can work)
    this.width = this.width + 'px'

    // // make our width 100pixels smaller than the container
    this.width = this.containerCoords.width + 'px';

    // // set our left position to be the container left position plus half the difference in widths between this
    // // component and the container, minus the 15px padding
    // this.left = this.containerCoords.left;

    // // set our left position to be the container top position plus half the difference in height between this
    // // component and the container
    this.top = this.containerCoords.top + 'px';
    this.height = this.containerCoords.height + 'px';
  }

}
