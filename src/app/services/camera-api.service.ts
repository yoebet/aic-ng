import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {MatDialog} from '@angular/material/dialog';
import {Observable} from 'rxjs';

import {environment} from '../../environments/environment';
import {Camera} from '../models/camera';
import {BaseService} from './base.service';
import {ApiResponse, StringResponse} from './camera-api/api-response';
import {Result, ValueResult} from '../models/result';
import {HeaderNames} from '../config';
import {filter, map} from 'rxjs/operators';


@Injectable()
export class CameraApiService extends BaseService<Camera> {

  baseUrl: string;


  constructor(protected http: HttpClient,
              protected dialog: MatDialog) {
    super(http, dialog);
    this.baseUrl = `${environment.apiBase}/aic`;
  }


  private aicPost<S extends ApiResponse<any>>(path: string, cameraId: number, body: any = null): Observable<S> {
    return this.pipeDefault(
      this.http.post<ValueResult<S>>(
        this.baseUrl + '/p' + path,
        body,
        {
          headers: new HttpHeaders({[HeaderNames.CameraId]: '' + cameraId})
        })
    ).pipe(
      filter((vr: ValueResult<S>) => {
        if (vr.code !== Result.CODE_SUCCESS) {
          this.showError(vr);
          return false;
        }
        return true;
      }),
      map((vr: ValueResult<S>) => vr.value),
      filter((res: S) => {
        if (res.errorCode !== ApiResponse.OK) {
          this.showErrorMessage(JSON.stringify(res, null, 2));
          return false;
        }
        return true;
      }),
    );
  }


  getDeviceNo(cameraId: number): Observable<StringResponse> {
    return this.aicPost<StringResponse>('/get_device', cameraId);
  }


}