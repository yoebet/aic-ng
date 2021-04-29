import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSelectionListChange} from '@angular/material/list';

import {TemplateInfo} from '../services/camera-api/api-response';
import {Camera} from '../models/camera';

@Component({
  selector: 'app-template-selector',
  templateUrl: './aic-template-selector.component.html',
  styleUrls: ['./aic-template-selector.component.css']
})
export class AicTemplateSelectorComponent {
  camera: Camera;
  templates: TemplateInfo[];

  constructor(public dialogRef: MatDialogRef<AicTemplateSelectorComponent, TemplateInfo>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.camera = data.camera;
    this.templates = data.templates;
  }

  onSelected(changeEvent: MatSelectionListChange) {
    const selected = changeEvent.options[0].value;
    if(selected){
      // console.log('selected 1:' + selected.collectionId);
      this.dialogRef.close(selected);
    }
  }

}
