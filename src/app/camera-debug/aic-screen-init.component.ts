import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

import {Camera} from '../models/camera';
import {CameraApiService} from '../services/camera-api.service';
import {
  CameraImg,
  StringResponse
} from '../services/camera-api/api-response';

@Component({
  selector: 'app-aic-screen-init',
  templateUrl: './aic-screen-init.component.html',
  styleUrls: ['./aic-screen-init.component.css']
})
export class AicScreenInitComponent implements OnInit {
  @ViewChild('canvas') canvas: ElementRef;
  @Input() camera: Camera;

  imgs: CameraImg;

  img: HTMLImageElement;
  context: CanvasRenderingContext2D;
  cursor = {x: 0, y: 0};
  dimension = {width: 0, height: 0};


  // 左上，右上，右下，左下
  // positionsStr = '0,0;3840,0;3840,2160;0,2160';
  // positionsStr = '0,0;1920,0;1920,1080;0,1080';
  positionsStr = '0,0;960,0;960,540;0,540';

  processes: { [name: string]: boolean } = {};

  constructor(private cameraApiService: CameraApiService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
  }

  initDraw() {
    this.img = new Image();
    // this.img.src = this.camera.apiBase + this.imgs.img1;
    this.img.src = 'http://localhost:3000/images/126.jpg';
    const canvas = this.canvas.nativeElement as HTMLCanvasElement;
    console.log(canvas);
    this.context = canvas.getContext('2d');
    console.log('initDraw...');

    this.img.onload = event => {
      console.log('img onload...');
      const scale = 2;
      const width = this.img.width / scale;
      const height = this.img.height / scale;
      canvas.setAttribute('width', '' + width);
      canvas.setAttribute('height', '' + height);
      this.context.drawImage(this.img, 0, 0, width, height);
      this.dimension.width = width;
      this.dimension.height = height;
    };
  }

  canvasDown(e) {
    if (!this.context) {
      return;
    }
    const context = this.context;
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
    } else if (x > this.dimension.width - tm.width) {
      x = this.dimension.width - tm.width;
    }
    if (y > this.dimension.height) {
      y = e.offsetY - 10;
    }
    context.fillText(text, x, y);
  }

  canvasMove(e) {
    this.cursor.x = e.offsetX;
    this.cursor.y = e.offsetY;
  }

  resetCanvas() {
    // this.context.fillStyle = '#fff';
    this.context.clearRect(0, 0, this.dimension.width, this.dimension.height);
    // this.context.fillRect(0, 0, this.dimension.width, this.dimension.height)
    // this.context.fillStyle = '#000';
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
}
