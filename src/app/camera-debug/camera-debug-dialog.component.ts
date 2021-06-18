import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Camera} from '../models/camera';
import {CameraImg} from '../services/camera-api/api-response';

@Component({
  selector: 'app-camera-debug-dialog',
  templateUrl: './camera-debug-dialog.component.html',
  styleUrls: ['./camera-debug-dialog.component.css']
})
export class CameraDebugDialogComponent implements OnInit {

  camera: Camera;
  cameraImg: CameraImg = new CameraImg();

  processes: { [name: string]: boolean } = {};

  constructor(public dialogRef: MatDialogRef<CameraDebugDialogComponent, any>,
              @Inject(MAT_DIALOG_DATA) public data) {
    this.camera = data.camera;
    this.cameraImg = data.camera;
  }

  ngOnInit() {

  }

}
