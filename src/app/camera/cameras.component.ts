import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CameraService} from '../services/camera.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable} from '@angular/material/table';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

import {Camera} from '../models/camera';
import {TableDatasource} from '../common/table-datasource';
import {Result} from '../models/result';
import {SessionSupportComponent} from '../common/session-support.component';
import {SessionService} from '../services/session.service';
import {User} from '../models/user';
import {CameraEditComponent} from './camera-edit.component';

@Component({
  selector: 'app-cameras',
  templateUrl: './cameras.component.html',
  styleUrls: ['./cameras.component.css']
})
export class CamerasComponent extends SessionSupportComponent implements AfterViewInit, OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Camera>;

  dataSource: TableDatasource<Camera>;

  displayedColumns: string[] = ['index', 'apiBase', 'deviceNo', 'createdAt', 'actions'];

  constructor(protected sessionService: SessionService,
              private cameraService: CameraService,
              private dialog: MatDialog) {
    super(sessionService);
  }

  protected onInit() {
    super.onInit();
    this.dataSource = new TableDatasource<Camera>();
  }

  protected onUserChange(user: User) {
    this.dataSource.setObservable(this.cameraService.list2());
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }


  edit(camera) {
    const dialogRef: MatDialogRef<CameraEditComponent, Camera> = this.dialog.open(
      CameraEditComponent, {
        disableClose: true,
        width: '480px',
        data: camera
      });

    const isNewRecord = !camera.id;
    dialogRef.afterClosed().subscribe((camera1: Camera) => {
      console.log(camera1);
      if (!camera1) {
        return;
      }
      if (isNewRecord) {
        this.dataSource.append(camera1);
      } else {
        // this.dataSource.update(camera1);
      }
    });
  }

  editNew() {
    const camera = new Camera();
    this.edit(camera);
  }

  remove(camera: Camera) {
    if (!confirm('确定要删除吗？')) {
      return;
    }
    this.cameraService.remove(camera)
      .subscribe((opr: Result) => {
        if (opr.code !== Result.CODE_SUCCESS) {
          this.cameraService.showError(opr);
          return;
        }
        this.dataSource.remove(camera);
      });
  }

}
