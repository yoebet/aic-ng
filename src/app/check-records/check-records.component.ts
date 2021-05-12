import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

import {Camera} from '../models/camera';
import {TableDatasource} from '../common/table-datasource';
import {CheckVideosComponent} from './check-videos.component';
import {CheckRecord} from '../models/check-record';
import {CheckRecordService} from '../services/check-record.service';
import {ServerStaticBase} from '../config';
import {Result} from '../models/result';
import {ImageViewerComponent} from '../viewer/image-viewer.component';
import {CheckTemplate} from '../models/check-template';
import {CheckTemplateService} from '../services/check-template.service';
import {TemplateViewerComponent} from '../templates/template-viewer.component';

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

  templateMap: Map<number, CheckTemplate> = new Map<number, CheckTemplate>();

  constructor(private checkRecordService: CheckRecordService,
              private checkTemplateService: CheckTemplateService,
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

  viewImage(rec: CheckRecord) {
    this.dialog.open(
      ImageViewerComponent, {
        disableClose: true,
        width: '680px',
        data: {url: ServerStaticBase + rec.img}
      });
  }

  private withTemplate(templateId: number, callAnyway: boolean, action: (template: CheckTemplate) => void): void {
    if (!templateId) {
      if (callAnyway) {
        action(null);
      }
      return;
    }
    const template = this.templateMap.get(templateId);
    if (template) {
      action(template);
      return;
    }
    this.checkTemplateService.getById2(templateId)
      .subscribe(tem => {
          this.templateMap.set(templateId, tem);
          action(tem);
        },
        error => {
          if (callAnyway) {
            action(null);
          }
        });
  }

  viewVideos(checkRecord: CheckRecord) {
    this.withTemplate(checkRecord.templateId, true,
      (template => this.showCheckVideos(checkRecord, template)));
  }

  showCheckVideos(checkRecord: CheckRecord, template: CheckTemplate) {
    this.dialog.open(
      CheckVideosComponent, {
        disableClose: true,
        // width: '540px',
        maxWidth: '96vw',
        data: {
          template, checkRecord
        }
      });
  }

  viewTemplate(rec: CheckRecord) {
    this.withTemplate(rec.templateId, false, (template => this.showTemplate(template)));
  }

  showTemplate(template: CheckTemplate) {
    if (!template.img) {
      return;
    }

    this.dialog.open(
      TemplateViewerComponent, {
        disableClose: true,
        width: '680px',
        data: {template}
      });
  }


  list() {
    this.processes.list = true;
    this.checkRecordService.listByCamera(this.camera.id)
      .subscribe((records: CheckRecord[]) => {
          this.processes.list = false;
          this.records = records;
          // this.records = this.records.reverse();
          // this.records.sort((r1, r2) => r2.createdAt ? r2.createdAt.localeCompare(r1.createdAt) : -1);
          this.dataSource.setData(this.records);
          this.snackBar.open('已获取所有比对回调记录');
        },
        error => this.processes.list = false,
        () => this.processes.list = false
      );
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
