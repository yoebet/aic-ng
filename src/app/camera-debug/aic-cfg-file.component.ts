import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

import {Camera} from '../models/camera';
import {CameraApiService} from '../services/camera-api.service';
import {ApiResponse, CheckRecord, StringResponse} from '../services/camera-api/api-response';
import {DeviceConfig} from '../services/camera-api/device-config';

@Component({
  selector: 'app-aic-cfg-file',
  templateUrl: './aic-cfg-file.component.html',
  styleUrls: ['./aic-cfg-file.component.css']
})
export class AicCfgFileComponent implements OnInit {
  @Input() camera: Camera;

  cfg: any;

  processes: { [name: string]: boolean } = {};

  constructor(protected cameraApiService: CameraApiService,
              protected dialog: MatDialog,
              protected snackBar: MatSnackBar) {
  }

  ngOnInit() {
  }

  getCfg() {
    this.processes.getCfg = true;
    this.cameraApiService.getCfg(this.camera.id)
      .subscribe((res: ApiResponse<any>) => {
          this.processes.getCfg = false;
          this.cfg = res.data;
        },
        error => this.processes.getCfg = false,
        () => this.processes.getCfg = false
      );
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
