import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../services/user.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTable} from '@angular/material/table';
import {User} from '../models/user';
import {TableDatasource} from '../common/table-datasource';
import {ListResult, Result} from '../models/result';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements AfterViewInit, OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<User>;

  dataSource: UserTableDatasource;

  displayedColumns: string[] = ['index', 'accountName', 'realName'];

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.dataSource = new UserTableDatasource();
    this.dataSource.setObservable(this.userService.list2());
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

}


export class UserTableDatasource extends TableDatasource<User> {

  constructor() {
    super();
  }

}
