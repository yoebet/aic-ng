import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import {ProductTestService} from '../services/product-test.service';
import {Result} from '../models/result';
import {validateForm} from '../common/utils';
import {ProductTest} from '../models/product-test';
import {Camera} from '../models/camera';


@Component({
  selector: 'app-product-test-edit',
  templateUrl: './product-test-edit.component.html',
  styleUrls: ['./product-test-edit.component.css']
})
export class ProductTestEditComponent implements OnInit {
  form = this.fb.group({
    cameraId: new FormControl(null, [Validators.required]),
    produceModel: new FormControl(null, [Validators.required]),
    produceNo: new FormControl(null, [Validators.required]),
    expectTotalTime: new FormControl(null, [Validators.required]),
    operationInterval: new FormControl(null, [Validators.required])
  });

  cameras: Camera[];
  productTest: ProductTest;

  constructor(private productTestService: ProductTestService,
              private fb: FormBuilder,
              public dialogRef: MatDialogRef<ProductTestEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {

    this.productTest = data.productTest;
    this.cameras = data.cameras;
  }

  ngOnInit() {
    const patch = {...this.productTest} as any;
    this.form.patchValue(patch);
  }


  save() {
    if (!this.productTest) {
      this.dialogRef.close();
      return;
    }
    if (!validateForm(this.form)) {
      return;
    }
    // Save
    const toSave = Object.assign({}, this.productTest, this.form.value);

    if (this.productTest.id) {
      delete toSave.createdAt;
      delete toSave.cameraLabel;
      delete toSave.cameraApiBase;
      delete toSave.operatorName;
      this.productTestService.update(toSave)
        .subscribe((opr: Result) => {
          if (opr.code !== Result.CODE_SUCCESS) {
            this.productTestService.showError(opr);
            return;
          }
          Object.assign(this.productTest, toSave);
          this.dialogRef.close(this.productTest);
        });
    } else {
      this.productTestService.create2(toSave)
        .subscribe((productTest: ProductTest) => {
          this.dialogRef.close(productTest);
        });

    }

  }
}
