import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {Observable} from 'rxjs';

import {environment} from '../../environments/environment';
import {BaseService} from './base.service';
import {CheckRecord} from '../models/check-record';
import {Result} from '../models/result';


@Injectable()
export class CheckRecordService extends BaseService<CheckRecord> {

  baseUrl: string;


  constructor(protected http: HttpClient,
              protected dialog: MatDialog) {
    super(http, dialog);
    this.baseUrl = `${environment.apiBase}/check_records`;
  }

  listByCamera(cameraId: number): Observable<CheckRecord[]> {
    return this.list2(`${this.baseUrl}/c/${cameraId}`);
  }

  listByProductTest(testId: number): Observable<CheckRecord[]> {
    return this.list2(`${this.baseUrl}/t/${testId}`);
  }

  deleteAllByCamera(cameraId: number): Observable<Result> {
    const url = `${this.baseUrl}/c/${cameraId}`;
    return this.pipeDefault(this.http.delete<Result>(url));
  }

}
