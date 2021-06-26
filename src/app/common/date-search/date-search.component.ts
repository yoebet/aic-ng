import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-date-search',
  templateUrl: './date-search.component.html',
  styleUrls: ['./date-search.component.css']
})
export class DateSearchComponent {

  @Input() filter: any;
  @Input() dateFieldName: string;
  @Input() dateName: string;

  nowDate: Date;

  constructor() {
    this.nowDate = new Date();
  }

}
