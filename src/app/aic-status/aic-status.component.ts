import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

import {Camera} from '../models/camera';
import {CameraApiService} from '../services/camera-api.service';
import {ApiResponse, CameraImg, CheckDetail, StringResponse} from '../services/camera-api/api-response';
import {DeviceConfig} from '../services/camera-api/device-config';
import {AicConfigComponent} from '../aic-config/aic-config.component';
import {AicCfgFileComponent} from '../aic-config/aic-cfg-file.component';

@Component({
  selector: 'app-aic-status',
  templateUrl: './aic-status.component.html',
  styleUrls: ['./aic-status.component.css']
})
export class AicStatusComponent implements OnInit {
  @Input() camera: Camera;
  @Input() cameraImg: CameraImg;

  deviceStatus: CheckDetail;
  canSetSystemTime = false;
  imageScale = 3;
  imageWidth = 3840;

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
          if (this.cameraImg.img) {
            this.snackBar.open('获取实时画面成功');
          } else {
            this.cameraApiService.showErrorMessage('未能获取实时画面');
          }
        },
        error => this.processes.getCameraImg = false,
        () => this.processes.getCameraImg = false
      );
  }

  getCheckDetail() {
    this.processes.getCheckDetail = true;
    this.cameraApiService.getCheckDetail(this.camera.id)
      .subscribe((res: ApiResponse<CheckDetail>) => {
          this.processes.getCheckDetail = false;
          this.deviceStatus = res.data;
          this.snackBar.open('获取设备状态成功');

          const deviceTs = this.deviceStatus.systemTime;
          if (deviceTs) {
            const thisTs = new Date().getTime();
            if (Math.abs(thisTs - deviceTs) > 2 * 60 * 1000) { // n minutes
              this.canSetSystemTime = true;
            }
          }

        },
        error => this.processes.getCheckDetail = false,
        () => this.processes.getCheckDetail = false
      );
  }

  setSystemTime() {
    if (!confirm('要同步设备的系统时间吗？')) {
      return;
    }

    this.processes.setSystemTime = true;
    this.cameraApiService.setSystemTime(this.camera.id)
      .subscribe((res: StringResponse) => {
          this.processes.setSystemTime = false;
          this.canSetSystemTime = false;
          this.snackBar.open('已同步设备的系统时间');

          this.cameraApiService.getCheckDetail(this.camera.id)
            .subscribe((res2: ApiResponse<CheckDetail>) => {
              this.deviceStatus = res2.data;
            });
        },
        error => this.processes.setSystemTime = false,
        () => this.processes.setSystemTime = false
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
