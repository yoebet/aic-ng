import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import {User} from '../models/user';
import {SessionService} from '../services/session.service';
import {Result, ValueResult} from '../models/result';


@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent {

  hidePassword = true;
  message: string;

  constructor(protected sessionService: SessionService,
              public dialogRef: MatDialogRef<LoginDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  cancel(): void {
    this.dialogRef.close();
    this.message = null;
  }

  login(name, pass) {
    this.sessionService.login(name, pass)
      .subscribe((result: ValueResult<User>) => {
        if (result && result.code === Result.CODE_SUCCESS) {
          this.message = null;
          this.dialogRef.close();
        } else {
          this.message = result.message || '用户名/密码错误';
        }
      }, (err) => {
        this.message = '发生错误了';
      });
  }

  onPassKeyup(name, pass, $event) {
    $event.stopPropagation();
    if ($event.code === 'Enter' && name && pass) {
      this.login(name, pass);
    }
  }

}
