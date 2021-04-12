import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

import {Camera} from '../models/camera';
import {CameraApiService} from '../services/camera-api.service';
import {ApiResponse, CheckCallbacks, CheckDetail, CID, StringResponse} from '../services/camera-api/api-response';

@Component({
  selector: 'app-aic-checker',
  templateUrl: './aic-checker.component.html',
  styleUrls: ['./aic-checker.component.css']
})
export class AicCheckerComponent implements OnInit {
  @Input() camera: Camera;

  // http://192.168.0.118:3000/api/cb/success
  // http://192.168.0.118:3000/api/cb/fail
  checkCallbacks: CheckCallbacks;

  deviceStatus: CheckDetail;

  processes: { [name: string]: boolean } = {};

  constructor(protected cameraApiService: CameraApiService,
              protected dialog: MatDialog,
              protected snackBar: MatSnackBar) {
  }

  ngOnInit() {
  }


  getCallbacks() {
    this.checkCallbacks = new CheckCallbacks();

    this.processes.getCallbacks = true;
    this.cameraApiService.getCallbacks(this.camera.id)
      .subscribe((res: ApiResponse<CheckCallbacks>) => {
          this.processes.getCallbacks = false;
          this.checkCallbacks = res.data;
        },
        error => this.processes.getCallbacks = false,
        () => this.processes.getCallbacks = false
      );
  }

  setSuccessCallback() {
    const url = this.checkCallbacks.checkSuccessTemplate;
    if (!url) {
      return;
    }

    this.processes.setSuccessCallback = true;
    this.cameraApiService.setSuccessCallback(this.camera.id, url)
      .subscribe((res: StringResponse) => {
          this.processes.setSuccessCallback = false;
          this.snackBar.open('已设置比对成功回调');
        },
        error => this.processes.setSuccessCallback = false,
        () => this.processes.setSuccessCallback = false
      );
  }

  setFailCallback() {
    const url = this.checkCallbacks.checkFailTemplate;
    if (!url) {
      return;
    }

    this.processes.setFailCallback = true;
    this.cameraApiService.setFailCallback(this.camera.id, url)
      .subscribe((res: StringResponse) => {
          this.processes.setFailCallback = false;
          this.snackBar.open('已设置比对失败回调');
        },
        error => this.processes.setFailCallback = false,
        () => this.processes.setFailCallback = false
      );
  }

  initCheckTemplate() {
    this.processes.initCheckTemplate = true;
    this.cameraApiService.initCheckTemplate(this.camera.id)
      .subscribe((res: StringResponse) => {
          this.processes.initCheckTemplate = false;
          this.snackBar.open('初始化比对模板成功');
        },
        error => this.processes.initCheckTemplate = false,
        () => this.processes.initCheckTemplate = false
      );
  }

  switchTemplate() {
    this.processes.switchTemplate = true;
    this.cameraApiService.switchTemplate(this.camera.id)
      .subscribe((res: ApiResponse<CID>) => {
          this.processes.switchTemplate = false;
          const cid = res.data.collectionId;
          this.snackBar.open('已切换模板：' + cid);
        },
        error => this.processes.switchTemplate = false,
        () => this.processes.switchTemplate = false
      );
  }

  stopCheck() {
    this.processes.stopCheck = true;
    this.cameraApiService.stopCheck(this.camera.id)
      .subscribe((res: StringResponse) => {
          this.processes.stopCheck = false;
          this.snackBar.open('已终止比对');
        },
        error => this.processes.stopCheck = false,
        () => this.processes.stopCheck = false
      );
  }

  getCheckDetail() {
    this.processes.getCheckDetail = true;
    this.cameraApiService.getCheckDetail(this.camera.id)
      .subscribe((res: ApiResponse<CheckDetail>) => {
          this.processes.getCheckDetail = false;
          this.deviceStatus = res.data;
          this.snackBar.open('获取状态成功');
        },
        error => this.processes.getCheckDetail = false,
        () => this.processes.getCheckDetail = false
      );
  }

}
