import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';

import {ProductTest, ProductTestFilter} from '../models/product-test';
import {TableDatasource} from '../common/table-datasource';
import {SessionSupportComponent} from '../common/session-support.component';
import {SessionService} from '../services/session.service';
import {ProductTestService} from '../services/product-test.service';
import {User} from '../models/user';
import {Camera} from '../models/camera';
import {CameraService} from '../services/camera.service';
import {UserService} from '../services/user.service';
import {Model} from '../models/model';

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
  operators: User[];
  filterForm: any & ProductTestFilter = {};

  displayedColumns: string[] = ['index', 'camera', 'produceModel', 'produceNo',
    'operator', 'testCompletedAt', 'testResult', 'actions'];

  constructor(protected sessionService: SessionService,
              private userService: UserService,
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
    this.loadData();

    this.userService.list2().subscribe(users => {
      this.operators = users;
    });
    this.cameraService.list2().subscribe(cameras => {
      this.cameras = cameras.sort(Camera.Comparator);
    });
  }

  loadData() {
    const form = this.filterForm ? {...this.filterForm} : {};

    const {completeDateFrom, completeDateTo} = form;
    if (completeDateFrom && typeof completeDateFrom !== 'string') {
      form.completeDateFrom = Model.dateString(completeDateFrom);
    }
    if (completeDateTo && typeof completeDateTo !== 'string') {
      form.completeDateTo = Model.dateString(completeDateTo);
    }

    this.dataSource.setObservable(
      this.productTestService.listCompleted(form));
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  filter() {
    this.loadData();
  }

  resetFilter() {
    this.filterForm = {};
    this.loadData();
  }

}
