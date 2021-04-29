import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable} from '@angular/material/table';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

import {ProductTest} from '../models/product-test';
import {TableDatasource} from '../common/table-datasource';
import {Result} from '../models/result';
import {SessionSupportComponent} from '../common/session-support.component';
import {SessionService} from '../services/session.service';
import {ProductTestService} from '../services/product-test.service';
import {User} from '../models/user';
import {ProductTestEditComponent} from './product-test-edit.component';
import {Camera} from '../models/camera';
import {CameraService} from '../services/camera.service';

@Component({
  selector: 'app-product-tests',
  templateUrl: './product-tests.component.html',
  styleUrls: ['./product-tests.component.css']
})
export class ProductTestsComponent extends SessionSupportComponent implements AfterViewInit, OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<ProductTest>;

  dataSource: TableDatasource<ProductTest>;

  cameras: Camera[];

  displayedColumns: string[] = ['index', 'camera', 'operator', 'produceModel', 'produceNo',
    'testResult', 'status', 'createdAt', 'actions'];

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
    this.dataSource.setObservable(this.productTestService.list2());
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }


  async edit(productTest) {

    if (!this.cameras) {
      this.cameras = await this.cameraService.list2().toPromise();
    }

    const dialogRef: MatDialogRef<ProductTestEditComponent, ProductTest> = this.dialog.open(
      ProductTestEditComponent, {
        disableClose: true,
        width: '580px',
        data: {productTest, cameras: this.cameras}
      });

    const isNewRecord = !productTest.id;
    dialogRef.afterClosed().subscribe((productTest1: ProductTest) => {
      console.log(productTest1);
      if (!productTest1) {
        return;
      }
      if (isNewRecord) {
        this.dataSource.append(productTest1);
      } else {
        // this.dataSource.update(productTest1);
      }
    });
  }

  editNew() {
    const productTest = new ProductTest();
    this.edit(productTest);
  }

  remove(productTest: ProductTest) {
    if (!confirm('确定要删除吗（未开始的测试可以删除）？')) {
      return;
    }
    this.productTestService.remove(productTest)
      .subscribe((opr: Result) => {
        if (opr.code !== Result.CODE_SUCCESS) {
          this.productTestService.showError(opr);
          return;
        }
        this.dataSource.remove(productTest);
      });
  }

}
