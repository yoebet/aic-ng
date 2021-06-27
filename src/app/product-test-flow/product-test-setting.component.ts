import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';

import {ProductTestService} from '../services/product-test.service';
import {Result} from '../models/result';
import {validateForm} from '../common/utils';
import {ProductTest} from '../models/product-test';
import {Camera} from '../models/camera';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-product-test-setting',
  templateUrl: './product-test-setting.component.html',
  styleUrls: ['./product-test-setting.component.css']
})
export class ProductTestSettingComponent implements OnInit {
  @Input() productTest: ProductTest;
  @Input() camera: Camera;

  settingForm = this.formBuilder.group({
    // cameraId: new FormControl(null, [Validators.required]),
    produceModel: new FormControl(null, [Validators.required]),
    produceNo: new FormControl(null, [Validators.required]),
    expectTotalTime: new FormControl(null, [Validators.required]),
    operationInterval: new FormControl(null, [Validators.required])
  });

  editing = false;

  constructor(private productTestService: ProductTestService,
              private formBuilder: FormBuilder,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
  }

  editSetting() {
    const {produceModel, produceNo, expectTotalTime, operationInterval} = this.productTest;
    this.settingForm.patchValue({produceModel, produceNo, expectTotalTime, operationInterval});
    this.editing = true;
  }

  cancelSetting() {
    this.editing = false;
  }

  saveSetting() {
    if (!validateForm(this.settingForm)) {
      return;
    }
    const {
      id, produceModel, produceNo,
      expectTotalTime, operationInterval
    } = this.productTest;

    // Save
    const toSave = Object.assign({
      produceModel, produceNo,
      expectTotalTime, operationInterval
    }, this.settingForm.value);

    if (id) {
      toSave.id = id;
      this.productTestService.update(toSave)
        .subscribe((opr: Result) => {
          if (opr.code !== Result.CODE_SUCCESS) {
            this.productTestService.showError(opr);
            return;
          }
          Object.assign(this.productTest, toSave);
          this.editing = false;
          this.snackBar.open('设置已保存');
        });
    } else {
      this.productTestService.create2(toSave)
        .subscribe((productTest: ProductTest) => {
          Object.assign(this.productTest, productTest);
          this.editing = false;
          this.snackBar.open('（新产品测试）设置已保存');
        });
    }

  }
}
