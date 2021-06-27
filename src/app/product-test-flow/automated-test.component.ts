import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatStepper} from '@angular/material/stepper';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';

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
import {Result} from '../models/result';

@Component({
  selector: 'app-automated-test',
  templateUrl: './automated-test.component.html',
  styleUrls: ['./automated-test.component.css']
})
export class AutomatedTestComponent extends SessionSupportComponent implements OnInit {
  @ViewChild(MatStepper) stepper: MatStepper;
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  productTest: ProductTest = new ProductTest();

  camera: Camera;
  cameraImg: CameraImg = new CameraImg();

  processes: { [name: string]: boolean } = {};

  constructor(protected sessionService: SessionService,
              private productTestService: ProductTestService,
              private cameraService: CameraService,
              private cameraApiService: CameraApiService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute) {
    super(sessionService);
  }

  protected withSession(user: User) {

    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      if (params.get('tid')) {
        this.productTestService.getById2(+params.get('tid'))
          .subscribe((productTest: ProductTest) => {
            this.productTest = productTest;
            if (!productTest.cameraId) {
              this.cameraService.showErrorMessage('摄像头未设置');
              return;
            }
            this.loadCamera(productTest.cameraId);
          });
      }
      if (params.get('cid')) {
        this.loadCamera(+params.get('cid'));
      }
    });

    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  loadCamera(cameraId) {
    this.cameraService.getById2(cameraId)
      .subscribe((camera: Camera) => {
        if (!camera.apiBase) {
          this.cameraService.showErrorMessage('摄像头API地址未设置');
          return;
        }
        this.productTest.cameraId = cameraId;
        this.camera = camera;
        if (!camera.deviceNo) {
          this.getDeviceNo();
        }
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


  startTest() {
    this.productTestService.startTest(this.productTest.id)
      .subscribe((result: Result) => {
        // ...

        this.snackBar.open('测试已开始');
        this.processes.startTest = false;
      });
  }


  completeTest(testResult: string) {
    this.productTestService.completeTest(this.productTest.id, testResult)
      .subscribe((result: Result) => {
        // ...

        this.snackBar.open('测试完成，。。');
        this.processes.completeTest = false;
      });
  }
}
