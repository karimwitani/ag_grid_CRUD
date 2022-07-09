import {
  Component,
  QueryList,
  ViewChildren,
  ViewContainerRef
} from "@angular/core";
import { ICellEditorAngularComp } from "ag-grid-angular";

// import { MatFormFieldModule } from "@angular/material/form-field"
// import {  MatSliderModule } from "@angular/material/slider"
// import {   MatDatepickerModule } from "@angular/material/datepicker"
// import {   MatNativeDateModule } from "@angular/material/core"
// import { MatInputModule } from "@angular/material/input"


@Component({
  selector: "input-cell",
  template: `
    <mat-form-field appearance="fill">
      <mat-label>Choose a date</mat-label>
      <input [(ngModel)]="inputDate" matInput [matDatepicker]="picker" />
      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker>
        <mat-datepicker-actions>
          <button mat-button matDatepickerCancel>Cancel</button>
          <button mat-raised-button color="primary" matDatepickerApply>Apply</button>
        </mat-datepicker-actions> 
      </mat-datepicker>

    </mat-form-field>

  `,
  styles: [
    ``
  ]
})
export class MatDatePickerComponent implements ICellEditorAngularComp {
  private params: any;

  public inputDate: Date;

  @ViewChildren("input", { read: ViewContainerRef })
  public inputs: QueryList<any>;
  private focusedInput: number = 0;

  agInit(params: any): void {
    this.params = params;

    // simple implementation - we assume a full name consists of a first and last name only
    this.inputDate = new Date();
  }

  // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
  ngAfterViewInit() {
    // this.focusOnInputNextTick(this.inputs.first);
  }

  private focusOnInputNextTick(input: ViewContainerRef) {
    window.setTimeout(() => {
      input.element.nativeElement.focus();
    }, 2);
  }

  getValue() {
    return this.inputDate;
  }

  isPopup(): boolean {
    return true;
  }
  getPopupPosition() {
    return "under"
  }

  /*
   * A little over complicated for what it is, but the idea is to illustrate how you might tab between multiple inputs
   * say for example in full row editing
   */
  onKeyDown(event: any): void {
    let key = event.which || event.keyCode;
    if (key == 9) {
      // tab
      this.preventDefaultAndPropagation(event);

      // either move one input along, or cycle back to 0
      this.focusedInput =
        this.focusedInput === this.inputs.length - 1
          ? 0
          : this.focusedInput + 1;

      let focusedInput = this.focusedInput;
      let inputToFocusOn = this.inputs.find((item: any, index: number) => {
        return index === focusedInput;
      });

      this.focusOnInputNextTick(inputToFocusOn);
    } else if (key == 13) {
      // enter
      // perform some validation on enter - in this example we assume all inputs are mandatory
      // in a proper application you'd probably want to inform the user that an input is blank
      this.inputs.forEach(input => {
        if (!input.element.nativeElement.value) {
          this.preventDefaultAndPropagation(event);
          this.focusOnInputNextTick(input);
        }
      });
    }
  }

  private preventDefaultAndPropagation(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }
}
