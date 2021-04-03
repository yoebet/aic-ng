import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

import {Camera} from '../models/camera';
import {CameraApiService} from '../services/camera-api.service';
import {ApiResponse, CameraImg} from '../services/camera-api/api-response';

@Component({
  selector: 'app-aic-screen-live',
  templateUrl: './aic-screen-live.component.html',
  styleUrls: ['./aic-screen-live.component.css']
})
export class AicScreenLiveComponent implements OnInit {
  @Input() camera: Camera;
  @Input() cameraImg: CameraImg;

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

}
