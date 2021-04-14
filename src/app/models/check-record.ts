import {Model} from './model';

export class CheckRecord extends Model {
  cameraId?: number;

  collectionId?: string;
  deviceNo?: string;
  success: boolean;

  img?: string; // （成功）比对时的图片
  video1?: string; // 开始比对前的录像（不是模板录像）
  video2?: string; // 比对时的录像

}
