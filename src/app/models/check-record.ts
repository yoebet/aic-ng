import {Model} from './model';

export class CheckRecord extends Model {
  cameraId?: number;

  collectionId?: string;
  deviceNo?: string;
  success: boolean;

  // 摄像头设备上
  deviceVideo1?: string; // 开始比对前的视频
  deviceVideo2?: string; // 比对时的视频

  // 服务器上
  serverVideo1?: string; // 开始比对前的视频
  serverVideo2?: string; // 比对时的视频

  // 已下载到服务器上
  videoDownloaded?: boolean;
}
