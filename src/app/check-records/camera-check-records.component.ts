import {AfterViewInit, Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CheckRecord} from '../models/check-record';
import {Observable} from 'rxjs';
import {CheckRecordService} from '../services/check-record.service';
import {CheckTemplateService} from '../services/check-template.service';
import {CheckRecordsComponent} from './check-records.component';
import {Result} from '../models/result';

@Component({
  selector: 'app-camera-check-records',
  templateUrl: './camera-check-records.component.html',
  styleUrls: ['./camera-check-records.component.css']
})
export class CameraCheckRecordsComponent extends CheckRecordsComponent implements AfterViewInit, OnInit {

  constructor(protected checkRecordService: CheckRecordService,
              protected checkTemplateService: CheckTemplateService,
              protected dialog: MatDialog,
              protected snackBar: MatSnackBar) {
    super(checkRecordService, checkTemplateService, dialog, snackBar);
  }

  doList(): Observable<CheckRecord[]> {
    return this.checkRecordService.listByCamera(this.camera.id);
  }

  deleteAll() {
    if (!confirm('要清除所有比对回调记录吗？')) {
      return;
    }

    this.processes.deleteAll = true;
    this.checkRecordService.deleteAllByCamera(this.camera.id)
      .subscribe((res: Result) => {
          this.processes.deleteAll = false;
          this.records = [];
          this.dataSource.setData(this.records);
          this.snackBar.open('已清除所有比对回调记录');
        },
        error => this.processes.deleteAll = false,
        () => this.processes.deleteAll = false
      );
  }

}
