import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {LoginDialogComponent} from '../account/login-dialog.component';

export class LoginSupport {

  private static loginModal: MatDialogRef<LoginDialogComponent> = null;

  constructor(protected dialog: MatDialog) {
  }

  openLoginDialog(): void {
    if (LoginSupport.loginModal) {
      return;
    }

    const dialogRef: MatDialogRef<LoginDialogComponent> = this.dialog.open(
      LoginDialogComponent, {
        width: '350px',
        data: {}
      });

    dialogRef.afterClosed().subscribe(result => {
      LoginSupport.loginModal = null;
    });

    LoginSupport.loginModal = dialogRef;
  }

}
