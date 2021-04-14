import {Model} from './model';

export class Camera extends Model {
  apiBase?: string;
  deviceNo?: string;
  label?: string;
  positions?: string; // 0,0,3840,0,3840,2160,0,2160;
}
