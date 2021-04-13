import {Model} from './model';

export class CheckRecord extends Model {
  cameraId?: number;

  collectionId?: string;
  deviceNo?: string;
  success: boolean;

  video1?: string; // 开始比对前的视频
  video2?: string; // 比对时的视频

}
