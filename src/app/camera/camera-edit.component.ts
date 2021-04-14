import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import {CameraService} from '../services/camera.service';
import {Result} from '../models/result';
import {validateForm} from '../common/utils';
import {Camera} from '../models/camera';


@Component({
  selector: 'app-camera-edit',
  templateUrl: './camera-edit.component.html',
  styleUrls: ['./camera-edit.component.css']
})

export class CameraEditComponent implements OnInit {
  form = this.fb.group({
    apiBase: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    label: [null],
    deviceNo: [null]
  });

  camera: Camera;

  constructor(private cameraService: CameraService,
              private fb: FormBuilder,
              public dialogRef: MatDialogRef<CameraEditComponent, Camera>,
              @Inject(MAT_DIALOG_DATA) public data: Camera) {

    this.camera = data;
  }

  ngOnInit() {
    const patch = {...this.camera} as any;
    this.form.patchValue(patch);
  }


  save() {
    if (!this.camera) {
      this.dialogRef.close();
      return;
    }
    if (!validateForm(this.form)) {
      return;
    }
    // Save
    const toSave = Object.assign({}, this.camera, this.form.value);

    if (this.camera.id) {
      delete toSave.createdAt;
      this.cameraService.update(toSave)
        .subscribe((opr: Result) => {
          if (opr.code !== Result.CODE_SUCCESS) {
            this.cameraService.showError(opr);
            return;
          }
          Object.assign(this.camera, toSave);
          this.dialogRef.close(this.camera);
        });
    } else {
      this.cameraService.create2(toSave)
        .subscribe((camera: Camera) => {
          this.dialogRef.close(camera);
        });

    }

  }
}
