import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {UserService} from '../services/user.service';
import {User} from '../models/user';
import {validateForm} from '../common/utils';

@Component({
  selector: 'app-reset-pwd',
  templateUrl: './user-pwd-reset.component.html',
  styleUrls: ['./user-pwd-reset.component.css']
})
export class UserPwdResetComponent {

  form = this.fb.group({
    accountName: [null],
    password: new FormControl(null, [Validators.required, Validators.minLength(4)]),
    passwordConfirm: new FormControl(null, [Validators.required, Validators.minLength(4),
      (field) => this.pwdValidator(field)]),
  });

  hidePassword = true;
  passwordConfirm: string;
  password: string;
  user: User;

  constructor(private fb: FormBuilder,
              protected userService: UserService,
              public dialogRef: MatDialogRef<UserPwdResetComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.user = data.user;
    this.form.patchValue(data.user);
  }

  private pwdValidator(pwdConfirmField) {
    if (!this.form) {
      return null;
    }
    if (!pwdConfirmField.value) {
      return null;
    }
    const passwordFiled = this.form.get('password');
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
    /*this.userService.resetPassword(this.user.accountName, this.password)
      .subscribe((result: ValueResult<User>) => {
        if (!result || result.code !== Result.CODE_SUCCESS) {
          this.userService.showError(result);
          return;
        }
        // alert('密码修改成功');
        this.userService.showMessage('修改密码成功');
        this.dialogRef.close();
      });*/
  }
}
