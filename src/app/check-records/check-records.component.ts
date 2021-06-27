import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Observable} from 'rxjs';

import {Camera} from '../models/camera';
import {TableDatasource} from '../common/table-datasource';
import {CheckVideosComponent} from './check-videos.component';
import {CheckRecord} from '../models/check-record';
import {CheckRecordService} from '../services/check-record.service';
import {ServerStaticBase} from '../config';
import {ImageViewerComponent} from '../viewer/image-viewer.component';
import {CheckTemplate} from '../models/check-template';
import {CheckTemplateService} from '../services/check-template.service';
import {TemplateViewerComponent} from '../templates/template-viewer.component';

@Component({
  template: ''
})
export abstract class CheckRecordsComponent implements AfterViewInit, OnInit {
  @Input() camera: Camera;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<CheckRecord>;

  dataSource: TableDatasource<CheckRecord>;

  records: CheckRecord[];
  processes: { [name: string]: boolean } = {};

  displayedColumns: string[] = ['index', 'collectionId', 'success', 'createdAt', 'actions'];

  templateMap: Map<number, CheckTemplate> = new Map<number, CheckTemplate>();

  constructor(protected checkRecordService: CheckRecordService,
              protected checkTemplateService: CheckTemplateService,
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

  viewImage(rec: CheckRecord) {
    this.dialog.open(
      ImageViewerComponent, {
        disableClose: true,
        width: '680px',
        data: {url: ServerStaticBase + rec.img}
      });
  }

  protected withTemplate(templateId: number, callAnyway: boolean, action: (template: CheckTemplate) => void): void {
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

  abstract doList(): Observable<CheckRecord[]>;

  list() {
    this.processes.list = true;
    this.doList()
      .subscribe((records: CheckRecord[]) => {
          this.processes.list = false;
          this.records = records;
          this.dataSource.setData(this.records);
          this.snackBar.open('已获取所有比对记录');
        },
        error => this.processes.list = false,
        () => this.processes.list = false
      );
  }


}
