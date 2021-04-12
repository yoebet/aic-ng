import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

import {Camera} from '../models/camera';
import {CameraApiService} from '../services/camera-api.service';
import {ApiResponse, CameraImg, CheckDetail} from '../services/camera-api/api-response';
import {DeviceConfig} from '../services/camera-api/device-config';
import {AicConfigComponent} from './aic-config.component';
import {AicCfgFileComponent} from './aic-cfg-file.component';

@Component({
  selector: 'app-aic-screen-live',
  templateUrl: './aic-screen-live.component.html',
  styleUrls: ['./aic-screen-live.component.css']
})
export class AicScreenLiveComponent implements OnInit {
  @Input() camera: Camera;
  @Input() cameraImg: CameraImg;

  deviceStatus: CheckDetail;

  processes: { [name: string]: boolean } = {};

  constructor(protected cameraApiService: CameraApiService,
              protected dialog: MatDialog,
              protected snackBar: MatSnackBar) {
  }

  ngOnInit() {
  }

  getCameraImg() {
    if (!this.cameraImg) {
      return;
    }
    this.processes.getCameraImg = true;
    this.cameraApiService.getCameraImg(this.camera.id)
      .subscribe((res: ApiResponse<CameraImg>) => {
          this.processes.getCameraImg = false;
          Object.assign(this.cameraImg, res.data);
          this.snackBar.open('获取实时画面成功');
        },
        error => this.processes.getCameraImg = false,
        () => this.processes.getCameraImg = false
      );
  }

  getCheckDetail() {
    if (!this.cameraImg) {
      return;
    }
    this.processes.getCheckDetail = true;
    this.cameraApiService.getCheckDetail(this.camera.id)
      .subscribe((res: ApiResponse<CheckDetail>) => {
          this.processes.getCheckDetail = false;
          this.deviceStatus = res.data;
          this.snackBar.open('获取设备状态成功');
        },
        error => this.processes.getCheckDetail = false,
        () => this.processes.getCheckDetail = false
      );
  }

  showDeviceConfig() {

    this.processes.getConfig = true;
    this.cameraApiService.getConfig(this.camera.id)
      .subscribe((res: ApiResponse<DeviceConfig>) => {
          this.processes.getConfig = false;

          this.dialog.open(
            AicConfigComponent, {
              disableClose: true,
              width: '480px',
              data: {camera: this.camera, config: res.data}
            });
        },
        error => this.processes.getConfig = false,
        () => this.processes.getConfig = false
      );

  }

  showDeviceCfgFile() {

    this.processes.getCfg = true;
    this.cameraApiService.getCfg(this.camera.id)
      .subscribe((res: ApiResponse<any>) => {
          this.processes.getCfg = false;

          this.dialog.open(
            AicCfgFileComponent, {
              disableClose: true,
              width: '480px',
              data: {camera: this.camera, cfg: res.data}
            });
        },
        error => this.processes.getCfg = false,
        () => this.processes.getCfg = false
      );

  }

}
