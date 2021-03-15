import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import {AccountService} from '../services/account.service';
import {Result} from '../models/result';
import {User} from '../models/user';
import {FormBuilder, FormControl, ValidatorFn, Validators} from '@angular/forms';
import {validateForm} from '../common/utils';

@Component({
  selector: 'app-change-pwd',
  templateUrl: './change-pwd.component.html',
  styleUrls: ['./change-pwd.component.css']
})
export class ChangePwdComponent {

  form = this.fb.group({
    accountName: [null],
    oriPassword: new FormControl(null, [Validators.required, Validators.minLength(4)]),
    newPassword: new FormControl(null, [Validators.required, Validators.minLength(4)]),
    passwordConfirm: new FormControl(null, [Validators.required, Validators.minLength(4),
      (field) => this._pwdValidator(field)
    ]),
  });

  hidePassword = true;
  oriPassword: string;
  passwordConfirm: string;
  newPassword: string;
  user: User;

  constructor(private fb: FormBuilder,
              protected accountService: AccountService,
              public dialogRef: MatDialogRef<ChangePwdComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.user = data.user;
    this.form.patchValue(data.user);
  }

  private _pwdValidator(pwdConfirmField) {
    if (!this.form) {
      return null;
    }
    if (!pwdConfirmField.value) {
      return null;
    }
    const passwordFiled = this.form.get('newPassword');
    const newPwd = passwordFiled.value;
    if (newPwd !== pwdConfirmField.value) {
      return {pattern: true};
    }
    return null;
  }

  cancel(): void {
    this.dialogRef.close();
    this.passwordConfirm = null;
  }

  save() {
    if (!validateForm(this.form)) {
      return;
    }

    this.accountService.resetPassword(this.oriPassword, this.newPassword)
      .subscribe((result: Result) => {
        if (!result || result.code !== Result.CODE_SUCCESS) {
          this.accountService.showError(result);
          return;
        }
        const beforePwdField = this.form.get('oriPassword').value;
        if (beforePwdField !== this.oriPassword) {
          return;
        }
        // console.log("原始密码为"+beforePwdField);
        this.accountService.showMessage('密码修改成功');
        // alert('密码修改成功');
        this.dialogRef.close();
      });
  }
}
