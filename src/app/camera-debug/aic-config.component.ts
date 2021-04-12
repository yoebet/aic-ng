import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

import {Camera} from '../models/camera';
import {CameraApiService} from '../services/camera-api.service';
import {StringResponse} from '../services/camera-api/api-response';
import {DeviceConfig} from '../services/camera-api/device-config';

@Component({
  selector: 'app-aic-config',
  templateUrl: './aic-config.component.html',
  styleUrls: ['./aic-config.component.css']
})
export class AicConfigComponent {
  camera: Camera;

  config: DeviceConfig;
  config2: DeviceConfig;
  editing = false;

  processes: { [name: string]: boolean } = {};

  constructor(protected cameraApiService: CameraApiService,
              protected dialog: MatDialog,
              protected snackBar: MatSnackBar,
              public dialogRef: MatDialogRef<AicConfigComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.camera = data.camera;
    this.config = data.config;
  }

  startEdit() {
    this.config2 = Object.assign({}, this.config);
    this.editing = true;
  }

  cancelEdit() {
    this.config2 = null;
    this.editing = false;
  }

  setConfig() {

    const updated = {};

    this.processes.setConfig = true;
    this.cameraApiService.setConfig(this.camera.id, this.config2)
      .subscribe((res: StringResponse) => {
          this.processes.setConfig = false;
          Object.assign(this.config, this.config2);
          this.editing = false;
          this.snackBar.open('已保存配置');
        },
        error => this.processes.setConfig = false,
        () => this.processes.setConfig = false
      );
  }

}
