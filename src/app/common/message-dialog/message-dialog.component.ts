import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.css']
})
export class MessageDialogComponent {

  msg: string;
  type: 'error' | 'info';

  constructor(
    public dialogRef: MatDialogRef<MessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.msg = data.msg;
    this.type = data.type || 'error';
  }

  static ShowMessageDialog(data, dialog: MatDialog) {
    return dialog.open(
      MessageDialogComponent, {
        disableClose: true,
        width: '380px',
        data
      });
  }

  cancel(): void {
    this.dialogRef.close();
    this.msg = null;
  }
}
