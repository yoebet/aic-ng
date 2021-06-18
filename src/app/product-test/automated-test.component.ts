import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {switchMap} from 'rxjs/operators';

import {User} from '../models/user';
import {Camera} from '../models/camera';
import {SessionSupportComponent} from '../common/session-support.component';
import {CameraImg, StringResponse} from '../services/camera-api/api-response';
import {SessionService} from '../services/session.service';
import {CameraService} from '../services/camera.service';
import {CameraApiService} from '../services/camera-api.service';
import {ProductTestService} from '../services/product-test.service';
import {ProductTest} from '../models/product-test';
import {CameraDebugDialogComponent} from '../camera-debug/camera-debug-dialog.component';

@Component({
  selector: 'app-automated-test',
  templateUrl: './automated-test.component.html',
  styleUrls: ['./automated-test.component.css']
})
export class AutomatedTestComponent extends SessionSupportComponent implements OnInit {
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  productTest: ProductTest;

  camera: Camera;
  cameraImg: CameraImg = new CameraImg();

  processes: { [name: string]: boolean } = {};

  constructor(protected sessionService: SessionService,
              private productTestService: ProductTestService,
              private cameraService: CameraService,
              private cameraApiService: CameraApiService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private _formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute) {
    super(sessionService);
  }


  protected withSession(user: User) {

    this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) => this.productTestService.getById2(+params.get('id')))
    ).subscribe((productTest: ProductTest) => {
      this.productTest = productTest;
      if (!productTest.cameraId) {
        this.cameraService.showErrorMessage('摄像头未设置');
        return;
      }
      this.cameraService.getById2(productTest.cameraId)
        .subscribe((camera: Camera) => {
          if (!camera.apiBase) {
            this.cameraService.showErrorMessage('摄像头API地址未设置');
            return;
          }
          this.camera = camera;
          if (!camera.deviceNo) {
            this.getDeviceNo();
          }
        });
    });

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  getDeviceNo() {
    this.processes.getDeviceNo = true;
    this.cameraApiService.getDeviceNo(this.camera.id)
      .subscribe((res: StringResponse) => {
          this.processes.getDeviceNo = false;
          this.camera.deviceNo = res.data;
          this.snackBar.open('获取摄像头序列号成功');
        },
        error => {
          this.snackBar.open('获取摄像头序列号失败');
          this.processes.getDeviceNo = false;
        },
        () => this.processes.getDeviceNo = false);
  }


  debugCamera() {

    const dialogRef: MatDialogRef<CameraDebugDialogComponent, any> = this.dialog.open(
      CameraDebugDialogComponent, {
        disableClose: true,
        maxWidth: '96vw',
        width: '96%',
        data: {
          camera: this.camera,
          cameraImg: this.cameraImg
        }
      });
  }

}
