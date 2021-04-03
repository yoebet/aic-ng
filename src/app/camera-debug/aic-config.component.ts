import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

import {Camera} from '../models/camera';
import {CameraApiService} from '../services/camera-api.service';
import {ApiResponse, CheckRecord, StringResponse} from '../services/camera-api/api-response';
import {DeviceConfig} from '../services/camera-api/device-config';

@Component({
  selector: 'app-aic-config',
  templateUrl: './aic-config.component.html',
  styleUrls: ['./aic-config.component.css']
})
export class AicConfigComponent implements OnInit {
  @Input() camera: Camera;

  config: DeviceConfig;

  processes: { [name: string]: boolean } = {};

  constructor(protected cameraApiService: CameraApiService,
              protected dialog: MatDialog,
              protected snackBar: MatSnackBar) {
  }

  ngOnInit() {
  }

  getConfig() {
    this.processes.getConfig = true;
    this.cameraApiService.getConfig(this.camera.id)
      .subscribe((res: ApiResponse<DeviceConfig>) => {
          this.processes.getConfig = false;
          this.config = res.data;
        },
        error => this.processes.getConfig = false,
        () => this.processes.getConfig = false
      );
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
