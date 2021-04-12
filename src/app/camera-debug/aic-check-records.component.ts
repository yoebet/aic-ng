import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

import {Camera} from '../models/camera';
import {CameraApiService} from '../services/camera-api.service';
import {ApiResponse, CheckRecord, StringResponse} from '../services/camera-api/api-response';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable} from '@angular/material/table';
import {TableDatasource} from '../common/table-datasource';
import {AicCfgFileComponent} from './aic-cfg-file.component';
import {ImageViewerComponent} from './image-viewer.component';
import {CheckVideosComponent} from './check-videos.component';

@Component({
  selector: 'app-aic-check-records',
  templateUrl: './aic-check-records.component.html',
  styleUrls: ['./aic-check-records.component.css']
})
export class AicCheckRecordsComponent implements AfterViewInit, OnInit {
  @Input() camera: Camera;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<CheckRecord>;

  records: CheckRecord[];

  processes: { [name: string]: boolean } = {};

  dataSource: TableDatasource<CheckRecord>;

  // {
  //     "collectionId": "bb",
  //     "checkValue": 0.4117647,
  //     "time": 1358794544052,
  //     "checkStatus": false,
  //     "id": 8,
  //     "isUpdate": false,
  //     "path1": "/video/face/VIDEO/2013-01-22/1358794527510.mp4",
  //     "path2": "/video/face/VIDEO/2013-01-22/1358794532837.mp4",
  //     "img": "/image/face/img/1358794533581-check.png"
  // }

  displayedColumns: string[] = ['index', 'collectionId', 'checkStatus', 'checkValue', 'time', 'isUpdate', /*'img',*/ 'actions'];

  constructor(protected cameraApiService: CameraApiService,
              protected dialog: MatDialog,
              protected snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.dataSource = new TableDatasource<CheckRecord>();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  getRemark() {
    this.processes.getRemark = true;
    this.cameraApiService.getRemark(this.camera.id)
      .subscribe((res: ApiResponse<CheckRecord[]>) => {
          this.processes.getRemark = false;
          this.records = res.data;
          this.records = this.records.reverse();
          // this.records.sort((r1, r2) => r2.time - r1.time);
          this.dataSource.setData(this.records);
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
          this.dataSource.setData(this.records);
          this.snackBar.open('已清除所有比对记录');
        },
        error => this.processes.delRemark = false,
        () => this.processes.delRemark = false
      );
  }

  viewImage(url: string) {
    this.dialog.open(
      ImageViewerComponent, {
        disableClose: true,
        width: '680px',
        data: {url}
      });
  }

  viewVideos(rec: CheckRecord) {
    this.dialog.open(
      CheckVideosComponent, {
        disableClose: true,
        width: '890px',
        data: {
          url1: this.camera.apiBase + rec.path1,
          url2: this.camera.apiBase + rec.path2
        }
      });
  }

}
