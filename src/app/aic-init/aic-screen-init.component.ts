import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

import {CameraApiService} from '../services/camera-api.service';
import {
  ApiResponse,
  CameraImg,
  StringResponse
} from '../services/camera-api/api-response';
import {Camera} from '../models/camera';


@Component({
  selector: 'app-aic-screen-init',
  templateUrl: './aic-screen-init.component.html',
  styleUrls: ['./aic-screen-init.component.css']
})
export class AicScreenInitComponent implements OnInit {
  @ViewChild('canvas') canvas: ElementRef;
  @Input() camera: Camera;

  cameraImg: CameraImg;

  processes: { [name: string]: boolean } = {};

  canvasSetup = false;
  canvasImage: HTMLImageElement;
  canvasContext: CanvasRenderingContext2D;
  canvasDimension = {width: 0, height: 0};

  imagePosition = {x: 0, y: 0};
  imageOriginalDimension = {width: 0, height: 0};
  imageScale = 0;

  // 左上，右上，右下，左下
  // 0,0;3840,0;3840,2160;0,2160;
  // 0,0;1920,0;1920,1080;0,1080;
  // 0,0;960,0;960,540;0,540
  positionsStr = '';
  positions: { x: number, y: number }[] = [];

  constructor(protected cameraApiService: CameraApiService,
              protected dialog: MatDialog,
              protected snackBar: MatSnackBar) {
  }

  ngOnInit() {
    /*if (this.cameraImg && this.cameraImg.img) {
      this.initDraw();
    }*/
  }

  getCameraImg() {
    this.processes.getCameraImg = true;
    // this.cameraApiService.getCameraImg(this.camera.id)
    this.cameraApiService.getCameraTransformImg(this.camera.id)
      .subscribe((res: ApiResponse<CameraImg>) => {
          this.processes.getCameraImg = false;
          // Object.assign(this.cameraImg, res.data);
          this.cameraImg = res.data;

          const positionsStr = this.camera.positions;
          if (positionsStr && !this.positionsStr) {
            const positions: number[] = positionsStr.split(/,/)
              .map(parseFloat).filter(f => !isNaN(f) && f >= 0);
            if (positions.length === 8) {
              const [ltx, lty, rtx, rty, rbx, rby, lbx, lby] = positions;
              this.positions = [{x: ltx, y: lty}, {x: rtx, y: rty}, {x: rbx, y: rby}, {x: lbx, y: lby}];
              this.positionsStr = positionsStr;
            }
          }

          this.initDraw();
        },
        error => this.processes.getCameraImg = false,
        () => this.processes.getCameraImg = false
      );
  }

  initDraw() {
    this.canvasImage = new Image();
    this.canvasImage.src = this.camera.apiBase + this.cameraImg.img;
    console.log('initDraw...');

    this.canvasImage.onload = event => {
      console.log('img onload...');
      this.drawCanvas();
      this.canvasSetup = true;
    };
  }

  canvasDown(e) {
    if (!this.canvasContext) {
      return;
    }
    if (this.positions.length >= 4) {
      this.snackBar.open('已选择4个点');
      return;
    }

    let x = e.offsetX;
    let y = e.offsetY;
    if (x < 0) {
      x = 0;
    }
    if (y < 0) {
      y = 0;
    }
    const scale = this.imageScale;
    const position = {x: x * scale, y: y * scale};
    if (this.positions.length > 0) {
      const last = this.positions[this.positions.length - 1];
      if (last.x === position.x && last.y === position.y) {
        return;
      }
    }
    this.positions.push(position);
    this.positionsStr = this.positions.map(p => `${p.x},${p.y}`).join(',');

    this.drawPosition(position);
  }

  drawPosition(position) {

    let {x, y} = position;
    const scale = this.imageScale;
    x = Math.round(x / scale);
    y = Math.round(y / scale);

    const context = this.canvasContext;
    context.fillStyle = 'red';

    context.beginPath();
    context.arc(x, y, 3, 0, 2 * Math.PI);
    context.fill();
    context.closePath();

    context.font = '20px \'\'';
    const text = '' + position.x + ',' + position.y;

    const tm: TextMetrics = context.measureText(text);
    const tmWidth = tm.width || text.length * 10;

    const dimension = this.canvasDimension;
    let textX = x - tmWidth / 2;
    let textY = y + 25;
    if (textX < 0) {
      textX = 0;
    } else if (textX > dimension.width - tmWidth) {
      textX = dimension.width - tmWidth;
    }
    if (textY > dimension.height) {
      textY = y - 10;
    }
    context.fillText(text, textX, textY);
  }

  canvasMove(e) {
    const scale = this.imageScale;
    let x = e.offsetX;
    let y = e.offsetY;
    if (x < 0) {
      x = 0;
    }
    if (y < 0) {
      y = 0;
    }
    this.imagePosition.x = x * scale;
    this.imagePosition.y = y * scale;
  }

  drawCanvas() {
    if (!this.canvasImage) {
      return;
    }

    let width = this.canvasImage.width;
    let height = this.canvasImage.height;
    this.imageOriginalDimension = {width, height};

    let scale = this.imageScale;
    if (scale === 0) {
      if (width > 4000) {
        scale = 4;
      } else if (width > 2400) {
        scale = 3;
      } else if (width > 1400) {
        scale = 2;
      } else {
        scale = 1;
      }
      this.imageScale = scale;
    }
    width = Math.round(width / scale);
    height = Math.round(height / scale);

    const canvas = this.canvas.nativeElement as HTMLCanvasElement;
    this.canvasContext = canvas.getContext('2d');
    canvas.setAttribute('width', '' + width);
    canvas.setAttribute('height', '' + height);

    this.canvasContext.clearRect(0, 0, width, height);

    this.canvasContext.drawImage(this.canvasImage, 0, 0, width, height);
    this.canvasDimension = {width, height};

    for (const position of this.positions) {
      this.drawPosition(position);
    }
    this.positionsStr = this.positions.map(p => `${p.x},${p.y}`).join(',');

    // this.canvasContext.fillStyle = '#fff';
    // this.canvasContext.fillRect(0, 0, width, height)
    // this.canvasContext.fillStyle = '#000';
  }

  resetPositions() {
    this.positions = [];
    this.drawCanvas();
  }

  initScreenPosition() {
    if (!this.positionsStr) {
      return;
    }
    const positions: number[] = this.positionsStr.split(/,/)
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
          this.camera.positions = this.positionsStr;
        },
        error => this.processes.initScreenPosition = false,
        () => this.processes.initScreenPosition = false
      );
  }
}
