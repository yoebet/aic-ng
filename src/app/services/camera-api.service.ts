import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {MatDialog} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';

import {environment} from '../../environments/environment';
import {Camera} from '../models/camera';
import {BaseService} from './base.service';
import {
  AddTemplatesResult, ApiResponse, CameraImg, CheckCallbacks, CheckRecord, ResponseTemplate,
  StringResponse, TemplateInfo
} from './camera-api/api-response';
import {Result, ValueResult} from '../models/result';
import {HeaderNames} from '../config';
import {RequestTemplate2} from './camera-api/api-request';
import {DeviceConfig} from './camera-api/device-config';


@Injectable()
export class CameraApiService extends BaseService<Camera> {

  baseUrl: string;


  constructor(protected http: HttpClient,
              protected dialog: MatDialog) {
    super(http, dialog);
    this.baseUrl = `${environment.apiBase}/aic`;
  }


  private pipeAicPost<S extends ApiResponse<any>>(obs: Observable<ValueResult<S>>): Observable<S> {
    return this.pipeDefault(obs)
      .pipe(
        filter((vr: ValueResult<S>) => {
          if (vr.code !== Result.CODE_SUCCESS) {
            this.showError(vr);
            return false;
          }
          return true;
        }),
        map((vr: ValueResult<S>) => vr.value),
        filter((res: S) => {
          const errorCode = res.errorCode;
          if (errorCode !== ApiResponse.OK) {
            let msg = res.errorMsg;
            if (!msg) {
              msg = ApiResponse.ErrorMsgs['' + errorCode];
              if (msg) {
                msg = `${errorCode}: ${msg}`;
              }
            }
            if (!msg) {
              msg = JSON.stringify(res, null, 2);
            }
            this.showErrorMessage(msg);
            return false;
          }
          return true;
        }),
      );
  }

  private aicPost<S extends ApiResponse<any>>(path: string, cameraId: number, body: any = null): Observable<S> {
    return this.pipeAicPost(
      this.http.post<ValueResult<S>>(
        this.baseUrl + '/p' + path,
        body,
        {
          headers: new HttpHeaders({[HeaderNames.CameraId]: '' + cameraId})
        })
    );
  }

  private aicPostForm<S extends ApiResponse<any>>(path: string, cameraId: number, body: any = null): Observable<S> {
    const params = new URLSearchParams();
    if (body) {
      const hasOwnProperty = Object.prototype.hasOwnProperty;
      for (const name in body) {
        if (!hasOwnProperty.call(body, name)) {
          continue;
        }
        params.set(name, body[name]);
      }
    }
    const bodyStr = params.toString();

    return this.pipeAicPost(
      this.http.post<ValueResult<S>>(
        this.baseUrl + '/p' + path,
        bodyStr,
        {
          headers: new HttpHeaders({
            [HeaderNames.CameraId]: '' + cameraId,
            'Content-Type': 'application/x-www-form-urlencoded'
          })
        })
    );
  }


  getDeviceNo(cameraId: number): Observable<StringResponse> {
    return this.aicPost<StringResponse>('/get_device', cameraId);
  }

  getCameraImg(cameraId: number): Observable<ApiResponse<CameraImg>> {
    return this.aicPost<ApiResponse<CameraImg>>('/get_camera_img', cameraId);
  }

  initScreenPosition(cameraId: number, positions: number[]): Observable<StringResponse> {
    return this.aicPost<StringResponse>('/init_screen_position', cameraId, {positions});
  }

  getCollection(cameraId: number): Observable<ApiResponse<ResponseTemplate>> {
    return this.aicPost<ApiResponse<ResponseTemplate>>('/get_collection', cameraId);
  }

  addTemplateH(cameraId: number, templates: RequestTemplate2[]): Observable<ApiResponse<AddTemplatesResult>> {
    return this.aicPost<ApiResponse<AddTemplatesResult>>('/add_template_h', cameraId, templates);
  }

  getTemplate(cameraId: number): Observable<ApiResponse<TemplateInfo[]>> {
    return this.aicPost<ApiResponse<TemplateInfo[]>>('/get_template', cameraId);
  }

  delTemplate(cameraId: number): Observable<StringResponse> {
    return this.aicPost<StringResponse>('/del_template', cameraId);
  }

  initCheckTemplate(cameraId: number): Observable<StringResponse> {
    return this.aicPost<StringResponse>('/init_check_template', cameraId);
  }

  switchTemplate(cameraId: number): Observable<StringResponse> {
    return this.aicPost<StringResponse>('/switch_template', cameraId);
  }

  getCallbacks(cameraId: number): Observable<ApiResponse<CheckCallbacks>> {
    return this.aicPost<ApiResponse<CheckCallbacks>>('/get_callbacks', cameraId);
  }

  setFailCallback(cameraId: number, url: string): Observable<StringResponse> {
    return this.aicPostForm<StringResponse>('/set_fail_callback', cameraId, {url});
  }

  setSuccessCallback(cameraId: number, url: string): Observable<StringResponse> {
    return this.aicPostForm<StringResponse>('/set_success_callback', cameraId, {url});
  }

  getRemark(cameraId: number): Observable<ApiResponse<CheckRecord[]>> {
    return this.aicPost<ApiResponse<CheckRecord[]>>('/get_remark', cameraId);
  }

  delRemark(cameraId: number): Observable<StringResponse> {
    return this.aicPost<StringResponse>('/del_remark', cameraId);
  }

  getConfig(cameraId: number): Observable<ApiResponse<DeviceConfig>> {
    return this.aicPost<ApiResponse<DeviceConfig>>('/get_config', cameraId);
  }

  configUpdate(cameraId: number, config: any): Observable<StringResponse> {
    return this.aicPostForm<StringResponse>('/config_update', cameraId, config);
  }

  getCfg(cameraId: number): Observable<ApiResponse<any>> {
    return this.aicPost<ApiResponse<any>>('/get_cfg', cameraId);
  }

  setCfg(cameraId: number, config: any): Observable<StringResponse> {
    return this.aicPostForm<StringResponse>('/set_cfg', cameraId, config);
  }

}
