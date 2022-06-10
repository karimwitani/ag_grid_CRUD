import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, map } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';


const APPL_IC = [{
  "date": "2021-09-25",
  "symbol": "AAPL",
  "reportedCurrency": "USD",
  "cik": "0000320193",
  "fillingDate": "2021-10-29",
  "acceptedDate": "2021-10-28 18:04:28",
  "calendarYear": "2021",
  "period": "FY",
  "revenue": 365817000000,
  "costOfRevenue": 212981000000,
  "grossProfit": 152836000000,
  "grossProfitRatio": 0.4177935962516778,
  "researchAndDevelopmentExpenses": 21914000000,
  "generalAndAdministrativeExpenses": 0.0,
  "sellingAndMarketingExpenses": 0.0,
  "sellingGeneralAndAdministrativeExpenses": 21973000000,
  "otherExpenses": 0.0,
  "operatingExpenses": 43887000000,
  "costAndExpenses": 256868000000,
  "interestIncome": 2843000000,
  "interestExpense": 2645000000,
  "depreciationAndAmortization": 11284000000,
  "ebitda": 123136000000,
  "ebitdaratio": 0.33660546120054563,
  "operatingIncome": 108949000000,
  "operatingIncomeRatio": 0.29782377527561593,
  "totalOtherIncomeExpensesNet": 258000000,
  "incomeBeforeTax": 109207000000,
  "incomeBeforeTaxRatio": 0.2985290459437369,
  "incomeTaxExpense": 14527000000,
  "netIncome": 94680000000,
  "netIncomeRatio": 0.2588179335569424,
  "eps": 5.67,
  "epsdiluted": 5.61,
  "weightedAverageShsOut": 16701272000,
  "weightedAverageShsOutDil": 16864919000,
  "link": "https://www.sec.gov/Archives/edgar/data/320193/000032019321000105/0000320193-21-000105-index.htm",
  "finalLink": "https://www.sec.gov/Archives/edgar/data/320193/000032019321000105/aapl-20210925.htm"
}, {
  "date": "2020-09-26",
  "symbol": "AAPL",
  "reportedCurrency": "USD",
  "cik": "0000320193",
  "fillingDate": "2020-10-30",
  "acceptedDate": "2020-10-29 18:06:25",
  "calendarYear": "2020",
  "period": "FY",
  "revenue": 274515000000,
  "costOfRevenue": 169559000000,
  "grossProfit": 104956000000,
  "grossProfitRatio": 0.38233247727810865,
  "researchAndDevelopmentExpenses": 18752000000,
  "generalAndAdministrativeExpenses": 0.0,
  "sellingAndMarketingExpenses": 0.0,
  "sellingGeneralAndAdministrativeExpenses": 19916000000,
  "otherExpenses": 0.0,
  "operatingExpenses": 38668000000,
  "costAndExpenses": 208227000000,
  "interestIncome": 3763000000,
  "interestExpense": 2873000000,
  "depreciationAndAmortization": 11056000000,
  "ebitda": 81020000000,
  "ebitdaratio": 0.2951386991603373,
  "operatingIncome": 66288000000,
  "operatingIncomeRatio": 0.24147314354406862,
  "totalOtherIncomeExpensesNet": 803000000,
  "incomeBeforeTax": 67091000000,
  "incomeBeforeTaxRatio": 0.24439830246070343,
  "incomeTaxExpense": 9680000000,
  "netIncome": 57411000000,
  "netIncomeRatio": 0.20913611278072236,
  "eps": 3.31,
  "epsdiluted": 3.28,
  "weightedAverageShsOut": 17352119000,
  "weightedAverageShsOutDil": 17528214000,
  "link": "https://www.sec.gov/Archives/edgar/data/320193/000032019320000096/0000320193-20-000096-index.htm",
  "finalLink": "https://www.sec.gov/Archives/edgar/data/320193/000032019320000096/aapl-20200926.htm"
}]

const IC_FIELDS = [
  {
    key: 'revenue',
    name: 'Revenue'
  },
  {
    key: 'grossProfit',
    name: 'Gross Profit'
  },
  {
    key: 'ebitda',
    name: 'EBITDA'
  },
  {
    key: 'operatingIncome',
    name: 'Operating Income'
  },
  {
    key: 'netIncome',
    name: 'Net Income'
  }]

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:5000/';
  constructor(private http: HttpClient) { }

  getData() {
    return [...APPL_IC]
  }

  getFields() {
    return [...IC_FIELDS];
  }

  async getFields_2() {
    let fields = await [...IC_FIELDS]
    console.log('getFields_2 complete')
    return fields;
  }

  //async fetch call and json return of response
  async getFlaskData() {
    const api = 'http://localhost:5000/';
    try {
      const response = await fetch(api);
      const data = await response.json()
      //console.log(data)
      return data
    } catch (error) {
      if (error) {
        console.log(error);
      }
    }
  }

  getApiDataHttpClient() {
    const api = 'http://localhost:5000/';
    return this.http.get(api);
  }

  async findAll(): Promise<any> {
    const headerDict = { 'Content-Type': 'application/json' }
    var requestOptions = {
      headers: new HttpHeaders(headerDict),
    }
    let result: any = []
    let response = await this.http.get<Object>(this.apiUrl, requestOptions);
    response.subscribe(fullData => Object.entries(fullData).forEach((element: any) =>
      result.push(element)
    ))

    return result
  }

  async findAll_2() {
    let response = this.http.get(this.apiUrl);
    return response

  }

  resolveAfterRetrieval() {
    return new Promise(resolve => {
      var serverData4$ = this.http.get(this.apiUrl);

      // //debug
      // console.log(serverData4$);

      resolve(serverData4$);
    })
  }

 

  async promiseObjAfterRetrieval() {
    var serverDataArray: any[] = [];
    return new Promise(resolve => {
      this.resolveAfterRetrieval().then((obs$: any) => {

        // //debug
        // console.log(obs$);

        obs$.subscribe((serverDataObject: any) => {

          // //debug
          // console.log(serverDataObject);

          serverDataObject.forEach((entry: any) => {
            serverDataArray.push(entry);
          })

          // //debug
          // console.log('promiseObjAfterRetrieval about to resolve ');

          resolve(serverDataArray);
        })
      })
    })
  }

}
