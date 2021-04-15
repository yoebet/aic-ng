import {Model} from './model';

export class CheckTemplate extends Model {
  cameraId?: number;
  deviceNo?: string;

  collectionId: string;

  img?: string; // 模板图片
  params?: string; // 模板参数 number[], join(',')

  status?: string; // N: Normal(In use), D: Deleted flag(Not list)
}
