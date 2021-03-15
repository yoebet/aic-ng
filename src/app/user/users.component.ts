import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../services/user.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable} from '@angular/material/table';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

import {User} from '../models/user';
import {TableDatasource} from '../common/table-datasource';
import {Result} from '../models/result';
import {UserEditComponent} from './user-edit.component';
import {UserPwdResetComponent} from './user-pwd-reset.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements AfterViewInit, OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<User>;

  dataSource: TableDatasource<User>;

  displayedColumns: string[] = ['index', 'accountName', 'realName', 'actions'];

  constructor(private userService: UserService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.dataSource = new TableDatasource<User>();
    this.dataSource.setObservable(this.userService.list2());
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }


  edit(user) {
    const dialogRef: MatDialogRef<UserEditComponent, User> = this.dialog.open(
      UserEditComponent, {
        disableClose: true,
        width: '480px',
        data: user
      });

    const isNewRecord = !user.id;
    dialogRef.afterClosed().subscribe((user1: User) => {
      console.log(user1);
      if (!user1) {
        return;
      }
      if (isNewRecord) {
        this.dataSource.append(user1);
      } else {
        // this.dataSource.update(user1);
      }
    });
  }

  editNew() {
    const user = new User();
    this.edit(user);
  }

  remove(user: User) {
    if (!confirm('确定要删除吗？')) {
      return;
    }
    this.userService.remove(user)
      .subscribe((opr: Result) => {
        if (opr.code !== Result.CODE_SUCCESS) {
          this.userService.showError(opr);
          return;
        }
        this.dataSource.remove(user);
      });
  }

  resetPwd(user) {
    this.dialog.open(
      UserPwdResetComponent, {
        disableClose: true,
        width: '480px',
        data: {user}
      });
  }
}
