import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';

import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {User} from '../models/user';
import {Result, ValueResult} from '../models/result';


@Injectable()
export class SessionService {


  private baseUrl: string;

  currentUser: User;

  currentUserSubject: BehaviorSubject<User> = new BehaviorSubject(null);


  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.apiBase}/session`;
  }

  login(name, pass): Observable<ValueResult<User>> {
    return this.http.post<ValueResult<User>>(this.baseUrl,
      {name, pass})
      .pipe(
        map(result => {
          if (result && result.code === Result.CODE_SUCCESS) {
            this.processLogin(result.value);
          }
          return result;
        }));
  }

  checkLogin(): Observable<ValueResult<User>> {
    return this.http.get<ValueResult<User>>(this.baseUrl)
      .pipe(
        map(result => {
          if (result && result.code === Result.CODE_SUCCESS) {
            this.processLogin(result.value);
          }
          return result;
        })
      );
  }

  private processLogin(user: User) {
    if (!user) {
      return;
    }
    if (this.currentUser && this.currentUser.accountName !== user.accountName) {
      console.log(`User Changed: ${this.currentUser.accountName} -> ${user.accountName}`);
    }

    this.currentUser = user;
    this.currentUserSubject.next(user);
    console.log(`User Login: ${this.currentUser.accountName}`);
  }

  logout(): Observable<Result> {
    return this.http.delete(this.baseUrl)
      .pipe(
        map((opr: Result) => {
          if (opr && opr.code === 0) {
            if (this.currentUser) {
              console.log(`User Logout: ${this.currentUser.accountName}`);
            }
            this.currentUser = null;
            this.currentUserSubject.next(null);
          }
          return opr;
        })
      );
  }

}
