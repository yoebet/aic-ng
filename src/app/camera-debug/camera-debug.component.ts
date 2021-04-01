import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

import {switchMap} from 'rxjs/operators';

import {CameraService} from '../services/camera.service';
import {Camera} from '../models/camera';
import {CameraApiService} from '../services/camera-api.service';
import {
  AddTemplatesResult,
  ApiResponse,
  CameraImg,
  ResponseTemplate,
  StringResponse,
  TemplateInfo
} from '../services/camera-api/api-response';
import {RequestTemplate2} from '../services/camera-api/api-request';

@Component({
  selector: 'app-camera-debug',
  templateUrl: './camera-debug.component.html',
  styleUrls: ['./camera-debug.component.css']
})
export class CameraDebugComponent implements OnInit {
  @ViewChild('canvas') canvas: ElementRef;

  camera: Camera;
  imgs: CameraImg;
  template: ResponseTemplate;
  templates: TemplateInfo[];

  newTemplateId: string;

  canvasEnv = {
    img: new Image(),
    context: {} as CanvasRenderingContext2D,
    cursor: {} as { x: number, y: number },
    dimension: {} as { width: number, height: number }
  };

  // 左上，右上，右下，左下
  // positionsStr = '0,0;3840,0;3840,2160;0,2160';
  // positionsStr = '0,0;1920,0;1920,1080;0,1080';
  positionsStr = '0,0;960,0;960,540;0,540';

  processes: { [name: string]: boolean } = {};

  constructor(private cameraService: CameraService,
              private cameraApiService: CameraApiService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) => this.cameraService.getById2(+params.get('id')))
    ).subscribe((camera: Camera) => {
      this.camera = camera;
      if (!camera.apiBase) {
        this.cameraService.showErrorMessage('摄像头API地址未设置');
      }
    });
  }

  getDeviceNo() {
    if (!this.camera) {
      return;
    }
    this.processes.getDeviceNo = true;
    this.cameraApiService.getDeviceNo(this.camera.id)
      .subscribe((res: StringResponse) => {
          this.processes.getDeviceNo = false;
          this.camera.deviceNo = res.data;
          this.snackBar.open('获取设备序列号成功');
        },
        error => this.processes.getDeviceNo = false,
        () => this.processes.getDeviceNo = false);
  }

  getCameraImg() {
    if (!this.camera) {
      return;
    }
    this.processes.getCameraImg = true;
    this.cameraApiService.getCameraImg(this.camera.id)
      .subscribe((res: ApiResponse<CameraImg>) => {
          this.processes.getCameraImg = false;
          this.imgs = res.data;
          this.snackBar.open('获取实时画面成功');
        },
        error => this.processes.getCameraImg = false,
        () => this.processes.getCameraImg = false
      );
  }

  initDraw() {
    const env = this.canvasEnv;
    // env.img.src = this.camera.apiBase + this.imgs.img1;
    env.img.src = 'http://localhost:8080/img/126.08ad092b.jpg';
    const canvas = this.canvas.nativeElement as HTMLCanvasElement;
    console.log(canvas);
    env.context = canvas.getContext('2d');
    console.log('initDraw...');

    env.img.onload = event => {
      console.log('img onload...');
      const scale = 2;
      const width = env.img.width / scale;
      const height = env.img.height / scale;
      canvas.setAttribute('width', '' + width);
      canvas.setAttribute('height', '' + height);
      env.context.drawImage(env.img, 0, 0, width, height);
      env.dimension.width = width;
      env.dimension.height = height;
    };
  }

  canvasDown(e) {
    const env = this.canvasEnv;
    const context = env.context;
    context.fillStyle = 'red';

    context.beginPath();
    context.arc(e.offsetX, e.offsetY, 3, 0, 2 * Math.PI);
    context.fill();
    context.closePath();

    context.font = '20px \'\'';
    const text = '' + e.offsetX + ',' + e.offsetY;

    const tm: TextMetrics = context.measureText(text);
    const tmWidth = tm.width || 80;

    let x = e.offsetX - tmWidth / 2;
    let y = e.offsetY + 25;
    console.log(tm.width, x);
    if (x < 0) {
      x = 0;
    } else if (x > env.dimension.width - tm.width) {
      x = env.dimension.width - tm.width;
    }
    if (y > env.dimension.height) {
      y = e.offsetY - 10;
    }
    context.fillText(text, x, y);
  }

  canvasMove(e) {
    const env = this.canvasEnv;
    env.cursor.x = e.offsetX;
    env.cursor.y = e.offsetY;
  }

  resetCanvas() { // 清空画布
    const env = this.canvasEnv;
    env.context.fillStyle = '#fff';
    env.context.clearRect(0, 0, env.dimension.width, env.dimension.height);
    // this.context.fillRect(0, 0, this.dimension.width, this.dimension.height)
    env.context.fillStyle = '#000';
  }

  initScreenPosition() {
    if (!this.camera) {
      return;
    }
    if (!this.positionsStr) {
      return;
    }
    const positions: number[] = this.positionsStr.split(/[,;/]/)
      .map(parseFloat).filter(f => !isNaN(f) && f >= 0);
    if (positions.length !== 8) {
      this.cameraApiService.showErrorMessage('需要4个坐标点(x,y)，8个数字');
      return;
    }

    this.processes.initScreenPosition = true;
    this.cameraApiService.initScreenPosition(this.camera.id, positions)
      .subscribe((res: StringResponse) => {
          this.processes.initScreenPosition = false;
          this.snackBar.open('初始化画面成功');
        },
        error => this.processes.initScreenPosition = false,
        () => this.processes.initScreenPosition = false
      );
  }

  getCollection() {
    if (!this.camera) {
      return;
    }
    this.processes.getCollection = true;
    this.cameraApiService.getCollection(this.camera.id)
      .subscribe((res: ApiResponse<ResponseTemplate>) => {
          this.processes.getCollection = false;
          this.template = res.data;
          this.snackBar.open('获取采集模板成功');
        },
        error => this.processes.getCollection = false,
        () => this.processes.getCollection = false
      );
  }

  addTemplateH() {
    if (!this.camera) {
      return;
    }
    if (!this.template) {
      this.snackBar.open('请先获取采集模板');
      return;
    }
    if (!this.newTemplateId) {
      this.snackBar.open('请输入模板id');
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
            this.cameraService.showErrorMessage('添加采集模板失败');
          } else {
            this.snackBar.open('添加采集模板成功');
          }
        },
        error => this.processes.addTemplateH = false,
        () => this.processes.addTemplateH = false
      );
  }

  getTemplate() {
    if (!this.camera) {
      return;
    }

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
    if (!this.camera) {
      return;
    }
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
