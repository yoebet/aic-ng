import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable} from '@angular/material/table';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

import {Camera} from '../models/camera';
import {TableDatasource} from '../common/table-datasource';
import {CheckVideosComponent} from '../common/viewer/check-videos.component';
import {CheckRecord} from '../models/check-record';
import {CheckRecordService} from '../services/check-record.service';
import {ServerStaticBase} from '../config';
import {Result} from '../models/result';

@Component({
  selector: 'app-check-records',
  templateUrl: './check-records.component.html',
  styleUrls: ['./check-records.component.css']
})
export class CheckRecordsComponent implements AfterViewInit, OnInit {
  @Input() camera: Camera;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<CheckRecord>;

  dataSource: TableDatasource<CheckRecord>;

  records: CheckRecord[];
  processes: { [name: string]: boolean } = {};

  displayedColumns: string[] = ['index', 'collectionId', 'success', 'createdAt', 'actions'];

  constructor(private checkRecordService: CheckRecordService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.dataSource = new TableDatasource<CheckRecord>();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  viewVideos(rec: CheckRecord) {
    const serverBase = ServerStaticBase;
    this.dialog.open(
      CheckVideosComponent, {
        disableClose: true,
        width: '890px',
        data: {
          url1: serverBase + rec.video1,
          url2: serverBase + rec.video2
        }
      });
  }


  getRemark() {
    this.processes.getRemark = true;
    this.checkRecordService.listByCamera(this.camera.id)
      .subscribe((records: CheckRecord[]) => {
          this.processes.getRemark = false;
          this.records = records;
          // this.records = this.records.reverse();
          // this.records.sort((r1, r2) => r2.createdAt ? r2.createdAt.localeCompare(r1.createdAt) : -1);
          this.dataSource.setData(this.records);
          this.snackBar.open('已获取所有比对回调记录');
        },
        error => this.processes.getRemark = false,
        () => this.processes.getRemark = false
      );
  }

  delRemark() {
    if (!confirm('要清除所有比对回调记录吗？')) {
      return;
    }

    this.processes.delRemark = true;
    this.checkRecordService.deleteAllByCamera(this.camera.id)
      .subscribe((res: Result) => {
          this.processes.delRemark = false;
          this.records = [];
          this.dataSource.setData(this.records);
          this.snackBar.open('已清除所有比对回调记录');
        },
        error => this.processes.delRemark = false,
        () => this.processes.delRemark = false
      );
  }

}
