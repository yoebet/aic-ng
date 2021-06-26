import {Model} from './model';

export class Camera extends Model {
  apiBase?: string;
  deviceNo?: string;
  label?: string;
  positions?: string; // 0,0,3840,0,3840,2160,0,2160;

  static Comparator = (c1, c2) => {
    const label1Num = +c1.label || 0;
    const label2Num = +c2.label || 0;
    return label1Num - label2Num;
  }

}
