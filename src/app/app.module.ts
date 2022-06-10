import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatTabsModule } from '@angular/material/tabs';;
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { IncomeStatementComponent } from './income-statement/income-statement.component';
import { AgGridModule } from 'ag-grid-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IncomeStatementTransposedComponent } from './income-statement-transposed/income-statement-transposed.component';
import { IncomeStatementDryComponent } from './income-statement-dry/income-statement-dry.component';
import { IncomeStatementsDryApiComponent } from './income-statements-dry-api/income-statements-dry-api.component';

@NgModule({
  declarations: [
    AppComponent,
    IncomeStatementComponent,
    IncomeStatementTransposedComponent,
    IncomeStatementDryComponent,
    IncomeStatementsDryApiComponent
  ],
  imports: [
    BrowserModule,
    AgGridModule.withComponents([]),
    MatTabsModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
