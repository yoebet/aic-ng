import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Observable} from 'rxjs';
import {CheckRecord} from '../models/check-record';
import {CheckRecordService} from '../services/check-record.service';
import {CheckTemplateService} from '../services/check-template.service';
import {CheckRecordsComponent} from './check-records.component';
import {ProductTest} from '../models/product-test';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {ProductTestService} from '../services/product-test.service';
import {Camera} from '../models/camera';
import {CameraService} from '../services/camera.service';

@Component({
  selector: 'app-product-check-records',
  templateUrl: './product-check-records.component.html',
  styleUrls: ['./product-check-records.component.css']
})
export class ProductCheckRecordsComponent extends CheckRecordsComponent implements AfterViewInit, OnInit {
  @Input() productTest: ProductTest;

  constructor(protected productTestService: ProductTestService,
              protected cameraService: CameraService,
              protected checkRecordService: CheckRecordService,
              protected checkTemplateService: CheckTemplateService,
              protected dialog: MatDialog,
              protected snackBar: MatSnackBar,
              private activatedRoute: ActivatedRoute) {
    super(checkRecordService, checkTemplateService, dialog, snackBar);
  }

  ngOnInit() {
    super.ngOnInit();

    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      if (params.get('tid')) {
        this.productTestService.getById2(+params.get('tid'))
          .subscribe((productTest: ProductTest) => {
            this.productTest = productTest;
            this.cameraService.getById2(productTest.cameraId)
              .subscribe((camera: Camera) => {
                this.camera = camera;
              });

            this.list();
          });
      }
    });
  }

  doList(): Observable<CheckRecord[]> {
    return this.checkRecordService.listByProductTest(this.productTest.id);
  }

}
