import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, Observable } from 'rxjs';
import { ColDef, ColumnApi, GridApi } from 'ag-grid-community';

@Component({
	selector: 'app-income-statements-dry-api',
	templateUrl: './income-statements-dry-api.component.html',
	styles: [
	]
})
export class IncomeStatementsDryApiComponent implements OnInit {
	rowData: any[] = [];
	columnDefs: any[] = [];
	serverData!: any;
	fields!: Object[];
	gridData: any;
	gridCols: any;


	//gridApi and columnApi
	//api: GridApi;



	constructor(private dataSvc: DataService) {




	}

	ngOnInit(): void {
		console.log('getPromiseData about to be called')
		this.getPromiseData().then((dataArray: any) => {

			//debug	
			this.serverData = dataArray;
			console.log(this.serverData)

		}).then(() => {
			this.getPromiseFields().then((fieldData: any) => {

				//debug	
				this.fields = fieldData;
				console.log(this.fields)
			})
		}).then(() => {
			this.fields.forEach((fieldObj: any) => {

				let rowEntry: any = {}

				// 	//debug	
				// console.log(fieldObj)
				// Object.entries(fieldObj)((field:Object)=> {
				// 	console.log(field)
				// })


				rowEntry['field'] = fieldObj['key']
				rowEntry['name'] = fieldObj['name']

				this.rowData.push(rowEntry);

				this.serverData.forEach((serverDataEntry: any) => {
					console.log(serverDataEntry);
					rowEntry[serverDataEntry['date']] = serverDataEntry[rowEntry['field']];
				});

			});

			// debug
			console.log(this.rowData);




			this.columnDefs.push({
				headerName: 'field',
				field: 'field',
				cellStyle: { 'font-size': 'large' },
				pinned: 'left',
			})




			this.columnDefs.push(...this.serverData.map((fieldEntry: any) => {
				return {
					headerName: fieldEntry.date,
					field: fieldEntry.date,
					editable: false,
				};
			}))
			// debug
			console.log(this.columnDefs);


		}).then(() => {
			this.gridData = this.rowData
			this.gridCols = this.columnDefs
		});





	}

	async getGridData() {
		let fields = await this.dataSvc.getFields();


		// findAll_2 : returns an observable
		let serverData$ = await this.dataSvc.findAll_2();
		var serverArray: any[] = [];

		// debug
		// console.log('serverData$');
		// console.log(serverData$);
		// //console.log(serverData$.length);
		// console.log(typeof (serverData$));

		serverData$.subscribe((dataEntry: any) => {

			// // debug
			// console.log(dataEntry);

			dataEntry.forEach((entry: any) => {

				// // debug
				// console.log(entry);
				serverArray.push(entry);
			})
			// debug
			console.log(serverArray);

		})


		// debug
		// console.log('fields');
		// console.log(fields);
		// //console.log(serverData$.length);
		// console.log(typeof (fields));


		interface LooseObject {
			[key: string]: any
		}

		var rowData: any = [];
		fields.forEach(field => {
			// //debug
			// console.log(field);

			var rowEntry: LooseObject = {};
			rowEntry['key'] = field['key']
			rowEntry['name'] = field['name']

			//debug
			//iterate over data to create row data
			serverArray.forEach((dataEntry: any) => {
				// console.log(dataEntry);
				let yearlyIcomeStatement: any = dataEntry;
				rowEntry[dataEntry['date']] = yearlyIcomeStatement[field['key']];
			})

			// // debug
			// console.log(rowEntry);
			// rowData.push(rowEntry);

			// // debug
			// console.log(rowData);
		})



		// debug
		// console.log('serverData$');
		// console.log(serverData$);
		// //console.log(serverData$.length);
		// console.log(typeof (serverData$));




	}




	// V2
	async getPromiseData() {
		var promiseData: any;
		await this.dataSvc.promiseObjAfterRetrieval().then(dataArray => {
			promiseData = dataArray;
		});

		// //debug
		// console.log(promiseData);

		return promiseData
	}

	async getPromiseFields() {
		return new Promise(resolve => {
			let fields = this.dataSvc.getFields()


			// //debug
			// console.log(fields);

			resolve(fields);
		})
	}



}
