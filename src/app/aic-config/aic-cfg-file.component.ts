import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

import {Camera} from '../models/camera';
import {CameraApiService} from '../services/camera-api.service';
import {StringResponse} from '../services/camera-api/api-response';

@Component({
  selector: 'app-aic-cfg-file',
  templateUrl: './aic-cfg-file.component.html',
  styleUrls: ['./aic-cfg-file.component.css']
})
export class AicCfgFileComponent {
  camera: Camera;

  cfg: any;
  cfgItems: { key: string, value: string }[];

  processes: { [name: string]: boolean } = {};

  constructor(protected cameraApiService: CameraApiService,
              protected dialog: MatDialog,
              protected snackBar: MatSnackBar,
              public dialogRef: MatDialogRef<AicCfgFileComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.camera = data.camera;
    this.cfg = data.cfg;

    this.cfgItems = [];
    const hasOwnProperty = Object.prototype.hasOwnProperty;
    for (const key in this.cfg) {
      if (!hasOwnProperty.call(this.cfg, key)) {
        continue;
      }
      this.cfgItems.push({key, value: this.cfg[key]});
    }
  }

  setCfg() {
    this.processes.setCfg = true;
    this.cameraApiService.setCfg(this.camera.id, {})
      .subscribe((res: StringResponse) => {
          this.processes.setCfg = false;
          this.snackBar.open('已修改配置文件');
        },
        error => this.processes.setCfg = false,
        () => this.processes.setCfg = false
      );
  }

}
