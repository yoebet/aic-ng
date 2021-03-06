import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

import {Camera} from '../models/camera';
import {CameraApiService} from '../services/camera-api.service';
import {ApiResponse, CheckCallbacks, CheckDetail, CID, StringResponse, TemplateInfo} from '../services/camera-api/api-response';
import {AicTemplateSelectorComponent} from './aic-template-selector.component';
import {ServerApiBase} from '../config';

@Component({
  selector: 'app-aic-checker',
  templateUrl: './aic-checker.component.html',
  styleUrls: ['./aic-checker.component.css']
})
export class AicCheckerComponent implements OnInit {
  @Input() camera: Camera;

  checkCallbacks: CheckCallbacks;

  deviceStatus: CheckDetail;

  processes: { [name: string]: boolean } = {};

  constructor(protected cameraApiService: CameraApiService,
              protected dialog: MatDialog,
              protected snackBar: MatSnackBar) {
  }

  ngOnInit() {
  }

  fillCallbacks() {
    if (!this.checkCallbacks) {
      this.checkCallbacks = new CheckCallbacks();
    }
    this.checkCallbacks.checkSuccessTemplate = `${ServerApiBase}/cb/success`;
    this.checkCallbacks.checkFailTemplate = `${ServerApiBase}/cb/fail`;
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
          this.snackBar.open('???????????????????????????');
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
          this.snackBar.open('???????????????????????????');
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
          this.snackBar.open('???????????????????????????');
        },
        error => this.processes.initCheckTemplate = false,
        () => this.processes.initCheckTemplate = false
      );
  }

  private setCurrentTemp(cid: string) {
    if (this.deviceStatus) {
      this.deviceStatus.collectionId = cid;
      if (this.deviceStatus.state === 0) {
        this.deviceStatus.state = 2;
      }
    }
  }

  /*switchTemplate() {
    this.processes.switchTemplate = true;
    this.cameraApiService.switchTemplate(this.camera.id)
      .subscribe((res: ApiResponse<CID>) => {
          this.processes.switchTemplate = false;
          const cid = res.data.collectionId;
          this.snackBar.open('??????????????????' + cid);
          this.setCurrentTemp(cid);
        },
        error => this.processes.switchTemplate = false,
        () => this.processes.switchTemplate = false
      );
  }*/

  setTemplate() {

    this.processes.setTemplate = true;
    this.cameraApiService.getTemplate(this.camera.id)
      .subscribe((res: ApiResponse<TemplateInfo[]>) => {
          this.processes.setTemplate = false;
          const templates = res.data;

          this.dialog.open(
            AicTemplateSelectorComponent, {
              disableClose: false,
              width: '560px',
              height: '480',
              data: {camera: this.camera, templates}
            })
            .afterClosed().subscribe((selected: TemplateInfo) => {
            if (selected) {
              this.doSetTemplate(selected.collectionId);
            }
          });
        },
        error => this.processes.setTemplate = false,
        () => this.processes.setTemplate = false
      );

  }

  doSetTemplate(collectionId: string) {
    this.processes.setTemplate = true;
    this.cameraApiService.setTemplate(this.camera.id, collectionId)
      .subscribe((res: ApiResponse<CID>) => {
          this.processes.setTemplate = false;
          const cid = res.data.collectionId;
          this.snackBar.open('??????????????????' + cid);
          this.setCurrentTemp(cid);
        },
        error => this.processes.setTemplate = false,
        () => this.processes.setTemplate = false
      );
  }

  startCheck() {
    this.processes.startCheck = true;
    this.cameraApiService.startCheck(this.camera.id)
      .subscribe((res: ApiResponse<CID>) => {
          this.processes.startCheck = false;
          const cid = res.data.collectionId;
          this.snackBar.open('??????????????????' + cid);
          this.setCurrentTemp(cid);
        },
        error => this.processes.startCheck = false,
        () => this.processes.startCheck = false
      );
  }

  stopCheck() {
    this.processes.stopCheck = true;
    this.cameraApiService.stopCheck(this.camera.id)
      .subscribe((res: StringResponse) => {
          this.processes.stopCheck = false;
          this.snackBar.open('???????????????');
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
          this.snackBar.open('??????????????????');
        },
        error => this.processes.getCheckDetail = false,
        () => this.processes.getCheckDetail = false
      );
  }

}
