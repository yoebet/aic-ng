import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';

import {Observable, combineLatest, of} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';

import {environment} from '../../environments/environment';
import {User} from '../models/user';
import {BaseService} from './base.service';


@Injectable()
export class UserService extends BaseService<User> {

  baseUrl: string;


  constructor(protected http: HttpClient,
              protected dialog: MatDialog) {
    super(http, dialog);
    this.baseUrl = `${environment.apiBase}/users`;
  }


}
