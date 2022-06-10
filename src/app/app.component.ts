import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'Karim IC';
  incomeStatement:any;

  constructor(titleService: Title){
    titleService.setTitle(this.title);
  }
  
  ngOnInit(){
  }
}
