import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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



	constructor(private dataSvc: DataService) { }

	ngOnInit(): void {

		// console.log('nbaDataInNgInit about to be called') //debug
		var nbaDataInNgInit = this.getGridNBAData().then((nbaTeamArray: NBATeamInterace[]) => {
			nbaTeamArray.forEach(teamFromArray => {
				//console.log(teamFromArray); // debug
			})
		})
		// console.log('beyond nbaDataInNgInit') //debug
		// console.log(nbaDataInNgInit) //debug


		// console.log('getPromiseData about to be called') //debug
		this.getPromiseData().then((dataArray: any) => {


			this.serverData = dataArray;
			// console.log(this.serverData) //debug

		}).then(() => {
			this.getPromiseFields().then((fieldData: any) => {



				this.fields = fieldData;
				// console.log(this.fields) //debug	
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
					// debug
					// console.log(serverDataEntry);
					rowEntry[serverDataEntry['date']] = serverDataEntry[rowEntry['field']];
				});

			});

			// debug
			// console.log(this.rowData);




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
					editable: true,
				};
			}))
			// debug
			// console.log(this.columnDefs);


		}).then(() => {
			this.gridData = this.rowData
			this.gridCols = this.columnDefs
		});


		// 	.then((nbaData: any) => {
		// 	console.log('getGridNBAData called')
		// 	console.log(nbaData);
		// })



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
			// console.log(serverArray);

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
		})





	}

	async getGridNBAData_2() {
		var serverArray: NBATeamInterace[] = [];
		await this.dataSvc.getNbaData().then(observable$ => {
			observable$.subscribe(serverData => {
				// console.log(entry); //debug
				Object.entries(serverData).forEach(([key, value], index) => {
					var team: NBATeamInterace = {
						abbreviation: value['abbreviation'],
						city: value['city'],
						conference: value['conference'],
						division: value['division'],
						full_name: value['full_name'],
						id: value['id'],
						name: value['name']
					};
					// console.log(team); //debug
					serverArray.push(team)
				})
				// nbaData = dataArray;
				// console.log(nbaData);

			})

		});
		// console.log(serverArray); //debug
		return serverArray;
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

	async getGridNBAData() {
		var nbaData: any;
		await this.dataSvc.getNBAPromise().then(nbaTeamsArray => {
			nbaData = nbaTeamsArray;
		})
		return nbaData;
	}

	async getPromiseFields() {
		return new Promise(resolve => {
			let fields = this.dataSvc.getFields()


			// //debug
			// console.log(fields);

			resolve(fields);
		})
	}
	httpOptions = {
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
			Authorization: 'my-auth-token'
		})
	};

	onCellValueChanged(event: any) {
		//debug
		let Form = JSON.stringify(event.data);
		var accss;
		console.log('value changes');
		console.log(event);
		console.log(event.node);
		// this.http.post('http://localhost:5000/editCellData', event, this.httpOptions).pipe()
		// this.http.get('http://localhost:5000/editCellData').subscribe(data => {
		//     console.log(`post request return ${data}`);
		// });
		this.dataSvc.postEditedCellData(Form).subscribe(
			article => {
				// #console.log(article);
			},
			err => {
				console.log(err);
			}
		);
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


