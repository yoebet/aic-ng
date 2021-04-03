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

  processes: { [name: string]: boolean } = {};

  constructor(protected cameraApiService: CameraApiService,
              protected dialog: MatDialog,
              protected snackBar: MatSnackBar,
              public dialogRef: MatDialogRef<AicConfigComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.camera = data.camera;
    this.config = data.config;
  }

  configUpdate() {
    this.processes.configUpdate = true;
    this.cameraApiService.configUpdate(this.camera.id, {})
      .subscribe((res: StringResponse) => {
          this.processes.configUpdate = false;
          this.snackBar.open('已更新配置');
        },
        error => this.processes.configUpdate = false,
        () => this.processes.configUpdate = false
      );
  }

}
