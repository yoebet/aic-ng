import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';

import {switchMap} from 'rxjs/operators';

import {CameraService} from '../services/camera.service';
import {Camera} from '../models/camera';
import {CameraApiService} from '../services/camera-api.service';
import {ApiResponse, StringResponse} from '../services/camera-api/api-response';

@Component({
  selector: 'app-camera-debug',
  templateUrl: './camera-debug.component.html',
  styleUrls: ['./camera-debug.component.css']
})
export class CameraDebugComponent implements OnInit {

  camera: Camera;

  constructor(private cameraService: CameraService,
              private cameraApiService: CameraApiService,
              private dialog: MatDialog,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) => this.cameraService.getById2(+params.get('id'))
      )
    ).subscribe((camera: Camera) => this.camera = camera);
  }

  getDeviceNo() {
    if (!this.camera) {
      return;
    }
    this.cameraApiService.getDeviceNo(this.camera.id)
      .subscribe((res: StringResponse) => {
        this.camera.deviceNo = res.data;
      });
  }
}
