import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

import {Camera} from '../models/camera';
import {CameraApiService} from '../services/camera-api.service';
import {AddTemplatesResult, ApiResponse, ResponseTemplate, StringResponse, TemplateInfo} from '../services/camera-api/api-response';
import {RequestTemplate2} from '../services/camera-api/api-request';

@Component({
  selector: 'app-aic-templates',
  templateUrl: './aic-templates.component.html',
  styleUrls: ['./aic-templates.component.css']
})
export class AicTemplatesComponent implements OnInit {
  @Input() camera: Camera;

  template: ResponseTemplate;
  templates: TemplateInfo[];

  newTemplateId: string;

  processes: { [name: string]: boolean } = {};

  constructor(private cameraApiService: CameraApiService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
  }

  getCollection() {
    this.processes.getCollection = true;
    this.cameraApiService.getCollection(this.camera.id)
      .subscribe((res: ApiResponse<ResponseTemplate>) => {
          this.processes.getCollection = false;
          this.template = res.data;
          this.newTemplateId = '';
          this.snackBar.open('获取采集模板成功');
        },
        error => this.processes.getCollection = false,
        () => this.processes.getCollection = false
      );
  }

  addTemplateH() {
    if (!this.template) {
      this.snackBar.open('请先获取采集模板');
      return;
    }
    if (!this.newTemplateId) {
      this.snackBar.open('请输入模板ID');
      return;
    }

    const ts: RequestTemplate2 = {
      collectionId: this.newTemplateId,
      temp: this.camera.apiBase + this.template.temp,
      params: this.template.param
    };
    this.processes.addTemplateH = true;
    this.cameraApiService.addTemplateH(this.camera.id, [ts])
      .subscribe((res: ApiResponse<AddTemplatesResult>) => {
          this.processes.addTemplateH = false;
          const tr: AddTemplatesResult = res.data;
          if (tr.fail.length > 0) {
            this.cameraApiService.showErrorMessage('添加采集模板失败');
          } else {
            this.snackBar.open('添加采集模板成功');
          }
        },
        error => this.processes.addTemplateH = false,
        () => this.processes.addTemplateH = false
      );
  }

  getTemplate() {
    this.processes.getTemplate = true;
    this.cameraApiService.getTemplate(this.camera.id)
      .subscribe((res: ApiResponse<TemplateInfo[]>) => {
          this.processes.getTemplate = false;
          this.templates = res.data;
          this.snackBar.open('已获取所有模板');
        },
        error => this.processes.getTemplate = false,
        () => this.processes.getTemplate = false
      );
  }

  delTemplate() {
    if (!confirm('要清除所有模板吗？')) {
      return;
    }

    this.processes.delTemplate = true;
    this.cameraApiService.delTemplate(this.camera.id)
      .subscribe((res: StringResponse) => {
          this.processes.delTemplate = false;
          this.templates = [];
          this.snackBar.open('已清除所有模板');
        },
        error => this.processes.delTemplate = false,
        () => this.processes.delTemplate = false
      );
  }
}
