import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';

import {ProductTest} from '../models/product-test';
import {TableDatasource} from '../common/table-datasource';
import {SessionSupportComponent} from '../common/session-support.component';
import {SessionService} from '../services/session.service';
import {ProductTestService} from '../services/product-test.service';
import {User} from '../models/user';
import {Camera} from '../models/camera';
import {CameraService} from '../services/camera.service';

@Component({
  selector: 'app-product-tests-completed',
  templateUrl: './product-tests-completed.component.html',
  styleUrls: ['./product-tests-completed.component.css']
})
export class ProductTestsCompletedComponent extends SessionSupportComponent implements AfterViewInit, OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<ProductTest>;

  dataSource: TableDatasource<ProductTest>;

  cameras: Camera[];

  displayedColumns: string[] = ['index', 'camera', 'produceModel', 'produceNo',
    'operator', 'testCompletedAt', 'testResult', 'actions'];

  constructor(protected sessionService: SessionService,
              private cameraService: CameraService,
              private productTestService: ProductTestService,
              private dialog: MatDialog) {
    super(sessionService);
  }

  protected onInit() {
    super.onInit();
    this.dataSource = new TableDatasource<ProductTest>();
  }

  protected withSession(user: User) {
    this.dataSource.setObservable(this.productTestService.listCompleted());
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }


}
