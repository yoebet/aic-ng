import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from '../../environments/environment';
import {Camera} from '../models/camera';
import {BaseService} from './base.service';
import {MatDialog} from '@angular/material/dialog';


@Injectable()
export class CameraService extends BaseService<Camera> {

  baseUrl: string;


  constructor(protected http: HttpClient,
              protected dialog: MatDialog) {
    super(http, dialog);
    this.baseUrl = `${environment.apiBase}/cameras`;
  }


}
