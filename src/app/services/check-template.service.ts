import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {Observable} from 'rxjs';

import {environment} from '../../environments/environment';
import {BaseService} from './base.service';
import {Result} from '../models/result';
import {CheckTemplate} from '../models/check-template';


@Injectable()
export class CheckTemplateService extends BaseService<CheckTemplate> {

  baseUrl: string;


  constructor(protected http: HttpClient,
              protected dialog: MatDialog) {
    super(http, dialog);
    this.baseUrl = `${environment.apiBase}/check_templates`;
  }

  listByCamera(cameraId: number): Observable<CheckTemplate[]> {
    return this.list2(`${this.baseUrl}/c/${cameraId}`);
  }

  deleteAllByCamera(cameraId: number): Observable<Result> {
    const url = `${this.baseUrl}/c/${cameraId}`;
    return this.pipeDefault(this.http.delete<Result>(url));
  }

}
