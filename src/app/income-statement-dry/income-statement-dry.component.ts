import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-income-statement-dry',
  templateUrl: './income-statement-dry.component.html',
  styles: [
  ]
})
export class IncomeStatementDryComponent {


  rowData;
  columnDefs: any;
  fieldValues: any;
  flaskData: any;


  constructor(private dataSvc: DataService) {
    let IC_DATA = dataSvc.getData();

    this.flaskData = this.dataSvc.getFlaskData()
    
    this.rowData = dataSvc.getFields()
      .map((field:any) => {

        let itemValues: any = {
          field: field.name
        }
        //console.log(field);

        IC_DATA.forEach(dataEntry => {
          let yearlyIcomeStatement: any = dataEntry;
          itemValues[dataEntry['date']] = yearlyIcomeStatement[field.key];
          //console.log(itemValues)

          // });
          // Object.values(this.flaskData).forEach(dataEntry => {
          //   console.log(dataEntry);
          //   let yearlyIcomeStatement: any = dataEntry;
          //itemValues[dataEntry['date']] = yearlyIcomeStatement[field.key];
        });

        return itemValues
      });

    this.columnDefs = [
      {
        headerName: 'field',
        field: 'field',
        cellStyle: { 'font-size': 'large' },
        pinned: 'left',
      }
    ];

    this.columnDefs.push(...IC_DATA.map(fieldEntry => {
      return {
        headerName: fieldEntry.date,
        field: fieldEntry.date,
        editable: true,
      };
    }));

    // dataSvc.getFlaskData()
    //   .subscribe((data) => {
    //     Object.values(data).forEach(value => {
    //       console.log(value);
    //     })
    //   });


  }

  // async getFlaskData() {
  //   const flaskObservable$ = this.dataSvc.getFlaskData();
  //   this.flaskData = await lastValueFrom(flaskObservable$);
  // }
}
