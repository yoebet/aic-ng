import {Component, Inject} from '@angular/core';

import {User} from '../models/user';
import {SessionService} from '../services/session.service';
import {ChangePwdComponent} from '../account/change-pwd.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-driver-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent {
  user: User;

  constructor(
    private sessionService: SessionService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<UserDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.user = data;
  }

  static ShowDetail(cu, dialog: MatDialog) {
    dialog.open(
      UserDetailComponent, {
        disableClose: true,
        width: '380px',
        data: cu
      });
  }

  goBack() {
    this.dialogRef.close();
  }

  userPwdChange() {
    const dialogRef: MatDialogRef<ChangePwdComponent, User> = this.dialog.open(
      ChangePwdComponent, {
        disableClose: true,
        width: '480px',
        data: {user: this.user}
      });
  }
}

