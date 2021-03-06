import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

import {Observable, throwError} from 'rxjs';
import {catchError, filter, map} from 'rxjs/operators';

import {MatDialog} from '@angular/material/dialog';

import {MessageDialogComponent} from '../common/message-dialog/message-dialog.component';
import {Model} from '../models/model';
import {ListResult, Result, ValueResult} from '../models/result';
import {LoginSupport} from './login-support';

export class BaseService<M extends Model> extends LoginSupport {

  protected baseUrl: string;

  constructor(protected http: HttpClient,
              protected dialog: MatDialog) {
    super(dialog);
  }


  /*  listForType<T>(url: string = null, params?: any): Observable<ListResult<T>> {
      url = url || this.baseUrl;
      return this.pipeDefault(this.http.get<ListResult<T>>(url, {params}));
    }*/

  list(url: string = null, params?: any): Observable<ListResult<M>> {
    url = url || this.baseUrl;
    return this.pipeDefault(this.http.get<ListResult<M>>(url, {params}));
  }

  list2(url: string = null, params?: any): Observable<M[]> {
    return this.list(url, params).pipe(map(this.unwrapListResult));
  }

  /*page(url: string = null, params?: any): Observable<ListResult<M>> {
    url = url || `${this.baseUrl}/page`;
    return this.list(url, params);
  }*/

  getById(id: number): Observable<ValueResult<M>> {
    const url = `${this.baseUrl}/${id}`;
    return this.getOne(url);
  }

  getById2(id: number): Observable<M> {
    return this.getById(id).pipe(map(this.unwrapValueResult));
  }

  getOne(url: string, params = null): Observable<ValueResult<M>> {
    return this.pipeDefault(this.http.get<ValueResult<M>>(url, {params}));
  }

  getOne2(url: string, params = null): Observable<M> {
    return this.getOne(url, params).pipe(map(this.unwrapValueResult));
  }

  create(model: M): Observable<ValueResult<M>> {
    return this.pipeDefault(this.http.post<ValueResult<M>>(this.baseUrl, model));
  }

  create2(model: M): Observable<M> {
    return this.create(model).pipe(map(this.unwrapValueResult));
  }

  remove(model: M | number): Observable<Result> {
    const id = this.modelId(model);
    const url = `${this.baseUrl}/${id}`;
    return this.pipeDefault(this.http.delete<Result>(url));
  }

  update(model: M): Observable<Result> {
    const url = `${this.baseUrl}/${model.id}`;
    return this.pipeDefault(this.http.put<Result>(url, model));
  }

  protected pipeDefault(obs: Observable<Result>) {
    return obs.pipe(
      filter(this.filterCommonFailure),
      catchError(this.handleError));
  }

  protected modelId(model: M | number): number {
    return typeof model === 'number' ? model : model.id;
  }


  protected unwrapValueResult = (result: ValueResult<M>) => this._unwrapValueResult(result);

  protected _unwrapValueResult(result: ValueResult<M>) {
    if (result.code !== Result.CODE_SUCCESS) {
      this.showError(result);
      return;
    }
    return result.value;
  }

  protected unwrapListResult = (result: ListResult<M>) => this._unwrapListResult(result);

  protected _unwrapListResult(result: ListResult<M>) {
    if (result.code !== Result.CODE_SUCCESS) {
      this.showError(result);
      return;
    }
    return result.list;
  }

  protected handleError = (err) => this._handleError(err);

  protected filterCommonFailure = (result: Result) => this._filterCommonFailure(result);

  protected _filterCommonFailure(result: Result) {

    if (!result) {
      this.showErrorMessage('???????????????');
      return false;
    }
    if (typeof result.code === 'undefined') {
      // this.showErrorMessage(result.message);
      return false;
    }
    if (result.code === Result.CODE_NOT_AUTHENTICATED) {
      this.openLoginDialog();
      return false;
    }
    if (result.code === Result.CODE_NOT_AUTHORIZED) {
      this.showErrorMessage(result.message || '?????????');
      return false;
    }

    return true;
  }


  private _handleError(error: any/*, caught*/): Observable<any> {
    /*
    error : {
      error: `{"code":0,"message":"code is Required"}`
      name: "HttpErrorResponse"
      code: false
      status: 400/401/500/0
      statusText: "Unauthorized"/"Unknown Error"
      url: '...'/null
    }
    */

    if (error.name === 'HttpErrorResponse') {
      const httpError = error as HttpErrorResponse;
      switch (httpError.status) {
        case 404:
          this.showErrorMessage('404 ??????');
          break;
        case 500:
          this.showErrorMessage('?????????????????????');
          break;
        case 0:
          this.showErrorMessage('???????????????????????????????????????');
          break;
        default:
          this.showErrorMessage('???????????????');
      }
    }

    console.error(error);
    return throwError(error);
  }

  showError(opr: Result) {
    if (!opr) {
      return;
    }
    if (opr.code === Result.CODE_SUCCESS) {
      return;
    }
    if (typeof opr.code === 'undefined') {
      return;
    }
    this.showErrorMessage(opr.message);
    // this.showMessage(opr.message);
  }


  showErrorMessage(msg: string) {
    if (!msg) {
      msg = Result.GENERAL_FAILURE_MESSAGE;
    }
    const data = {msg, type: 'error'};
    MessageDialogComponent.ShowMessageDialog(data, this.dialog);
    // alert(msg || Result.GENERAL_FAILURE_MESSAGE);
  }

  showMessage(msg: string) {
    if (!msg) {
      return;
    }
    const data = {msg, type: 'info'};
    MessageDialogComponent.ShowMessageDialog(data, this.dialog);
    // alert(msg || Result.GENERAL_FAILURE_MESSAGE);
  }
}
