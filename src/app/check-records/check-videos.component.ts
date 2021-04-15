import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ServerStaticBase} from '../config';
import {CheckTemplate} from '../models/check-template';
import {CheckRecord} from '../models/check-record';

@Component({
  selector: 'app-check-videos',
  templateUrl: './check-videos.component.html',
  styleUrls: ['./check-videos.component.css']
})
export class CheckVideosComponent {
  template: CheckTemplate;
  checkRecord: CheckRecord;
  serverBase = ServerStaticBase;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.template = data.template;
    this.checkRecord = data.checkRecord;
  }

}
