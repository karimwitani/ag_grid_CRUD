import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatTabsModule } from '@angular/material/tabs';;
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { IncomeStatementComponent } from './income-statement/income-statement.component';
import { AgGridModule } from 'ag-grid-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IncomeStatementTransposedComponent } from './income-statement-transposed/income-statement-transposed.component';
import { IncomeStatementDryComponent } from './income-statement-dry/income-statement-dry.component';
import { IncomeStatementsDryApiComponent } from './income-statements-dry-api/income-statements-dry-api.component';
import { NbaGridComponent } from './nba-grid/nba-grid.component';
import { AthleteEditScreenComponent } from './athlete-edit-screen/athlete-edit-screen.component';
import { DropDownRendererComponent } from './drop-down-renderer/drop-down-renderer.component';
import { CustomDateComponent } from './custom-date/custom-date.component';
import { PrimeCellEditorComponent } from './prime-cell-editor/prime-cell-editor.component';
import { MatDatePickerComponent } from './mat-date-picker/mat-date-picker.component';
import { MatFormFieldModule } from "@angular/material/form-field"
import {  MatSliderModule } from "@angular/material/slider"
import {   MatDatepickerModule } from "@angular/material/datepicker"
import {   MatNativeDateModule } from "@angular/material/core"
import { MatInputModule } from "@angular/material/input"
import { MatButtonModule } from '@angular/material/button';
import { ActionsButtonRendererComponent } from './actions-button-renderer/actions-button-renderer.component';
import { MutlyActionButtonRendererComponent } from './mutly-action-button-renderer/mutly-action-button-renderer.component';
import { NbaDualGridComponent } from './nba-dual-grid/nba-dual-grid.component';
import { NbaSecondaryGridComponent } from './nba-secondary-grid/nba-secondary-grid.component';
import { CancelEditButtonRendererComponent } from './cancel-edit-button-renderer/cancel-edit-button-renderer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CellValidationRendererComponent } from './cell-validation-renderer/cell-validation-renderer.component';
import { ValidationCustomTooltipComponent } from './validation-custom-tooltip/validation-custom-tooltip.component';



@NgModule({
  declarations: [
    AppComponent,
    IncomeStatementComponent,
    IncomeStatementTransposedComponent,
    IncomeStatementDryComponent,
    IncomeStatementsDryApiComponent,
    NbaGridComponent,
    AthleteEditScreenComponent,
    DropDownRendererComponent,
    CustomDateComponent,
    PrimeCellEditorComponent,
    MatDatePickerComponent,
    ActionsButtonRendererComponent,
    MutlyActionButtonRendererComponent,
    NbaDualGridComponent,
    NbaSecondaryGridComponent,
    CancelEditButtonRendererComponent,
    CellValidationRendererComponent,
    ValidationCustomTooltipComponent,
    

  ],
  imports: [
    BrowserModule,
    AgGridModule.withComponents([MatDatePickerComponent, DropDownRendererComponent, PrimeCellEditorComponent]),
    MatTabsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatSliderModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatButtonModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
