import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

import {CheckTemplate} from '../models/check-template';
import {ServerStaticBase} from '../config';

@Component({
  selector: 'app-template-viewer',
  templateUrl: './template-viewer.component.html',
  styleUrls: ['./template-viewer.component.css']
})
export class TemplateViewerComponent {
  template: CheckTemplate;
  serverBase = ServerStaticBase;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.template = data.template;
  }

}
