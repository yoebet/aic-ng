import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {Observable} from 'rxjs';

import {environment} from '../../environments/environment';
import {BaseService} from './base.service';
import {Result} from '../models/result';
import {ProductTest} from '../models/product-test';


@Injectable()
export class ProductTestService extends BaseService<ProductTest> {

  baseUrl: string;


  constructor(protected http: HttpClient,
              protected dialog: MatDialog) {
    super(http, dialog);
    this.baseUrl = `${environment.apiBase}/product_tests`;
  }

  listCurrent(): Observable<ProductTest[]> {
    const url = `${this.baseUrl}/current`;
    return this.list2(url);
  }

  listCompleted(): Observable<ProductTest[]> {
    const url = `${this.baseUrl}/completed`;
    return this.list2(url);
  }

  startTest(id: number): Observable<Result> {
    const url = `${this.baseUrl}/${id}/start`;
    return this.pipeDefault(this.http.post<Result>(url, null));
  }

  completeTest(id: number, testResult: string): Observable<Result> {
    const url = `${this.baseUrl}/${id}/complete`;
    return this.pipeDefault(this.http.post<Result>(url, {testResult}));
  }

}
