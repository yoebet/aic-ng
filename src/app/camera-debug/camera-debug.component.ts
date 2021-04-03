import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

import {switchMap} from 'rxjs/operators';

import {CameraService} from '../services/camera.service';
import {Camera} from '../models/camera';
import {CameraApiService} from '../services/camera-api.service';
import {ApiResponse, CameraImg, StringResponse} from '../services/camera-api/api-response';
import {SessionSupportComponent} from '../common/session-support.component';
import {SessionService} from '../services/session.service';
import {User} from '../models/user';
import {AicConfigComponent} from './aic-config.component';
import {AicCfgFileComponent} from './aic-cfg-file.component';
import {DeviceConfig} from '../services/camera-api/device-config';

@Component({
  selector: 'app-camera-debug',
  templateUrl: './camera-debug.component.html',
  styleUrls: ['./camera-debug.component.css']
})
export class CameraDebugComponent extends SessionSupportComponent implements OnInit {

  camera: Camera;
  cameraImg: CameraImg = new CameraImg();

  processes: { [name: string]: boolean } = {};

  constructor(protected sessionService: SessionService,
              private cameraService: CameraService,
              private cameraApiService: CameraApiService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private activatedRoute: ActivatedRoute) {
    super(sessionService);
  }


  protected withSession(user: User) {
    this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) => this.cameraService.getById2(+params.get('id')))
    ).subscribe((camera: Camera) => {
      if (!camera.apiBase) {
        this.cameraService.showErrorMessage('摄像头API地址未设置');
        return;
      }
      this.camera = camera;
    });
  }

  getDeviceNo() {
    this.processes.getDeviceNo = true;
    this.cameraApiService.getDeviceNo(this.camera.id)
      .subscribe((res: StringResponse) => {
          this.processes.getDeviceNo = false;
          this.camera.deviceNo = res.data;
          this.snackBar.open('获取设备序列号成功');
        },
        error => this.processes.getDeviceNo = false,
        () => this.processes.getDeviceNo = false);
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
