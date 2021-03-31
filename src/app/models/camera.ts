import {Model} from './model';
import {CameraImg} from '../services/camera-api/api-response';

export class Camera extends Model {
  apiBase?: string;
  deviceNo?: string;
}
