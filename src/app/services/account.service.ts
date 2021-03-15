import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {MatDialog} from '@angular/material/dialog';

import {Observable} from 'rxjs';

import {environment} from '../../environments/environment';
import {User} from '../models/user';
import {Result, ValueResult} from '../models/result';
import {BaseService} from './base.service';


@Injectable()
export class AccountService extends BaseService<User> {

  constructor(protected http: HttpClient,
              protected dialog: MatDialog) {
    super(http, dialog);
    const apiBase = environment.apiBase || '';
    this.baseUrl = `${apiBase}/account`;
  }

  resetPassword(password: string, newPassword: string): Observable<Result> {
    const url = `${this.baseUrl}/resetPass`;
    const form = {password, newPassword};
    return super.pipeDefault(this.http.post<Result>(url, form));
  }

}
