import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

import {Camera} from '../models/camera';
import {CameraApiService} from '../services/camera-api.service';
import {ApiResponse, CheckRecord, StringResponse} from '../services/camera-api/api-response';

@Component({
  selector: 'app-aic-check-records',
  templateUrl: './aic-check-records.component.html',
  styleUrls: ['./aic-check-records.component.css']
})
export class AicCheckRecordsComponent implements OnInit {
  @Input() camera: Camera;

  records: CheckRecord[];

  processes: { [name: string]: boolean } = {};

  constructor(protected cameraApiService: CameraApiService,
              protected dialog: MatDialog,
              protected snackBar: MatSnackBar) {
  }

  ngOnInit() {
  }

  getRemark() {
    this.processes.getRemark = true;
    this.cameraApiService.getRemark(this.camera.id)
      .subscribe((res: ApiResponse<CheckRecord[]>) => {
          this.processes.getRemark = false;
          this.records = res.data;
          this.snackBar.open('已获取所有比对记录');
        },
        error => this.processes.getRemark = false,
        () => this.processes.getRemark = false
      );
  }

  delRemark() {
    if (!confirm('要清除所有比对记录吗？')) {
      return;
    }

    this.processes.delRemark = true;
    this.cameraApiService.delRemark(this.camera.id)
      .subscribe((res: StringResponse) => {
          this.processes.delRemark = false;
          this.records = [];
          this.snackBar.open('已清除所有比对记录');
        },
        error => this.processes.delRemark = false,
        () => this.processes.delRemark = false
      );
  }

}
