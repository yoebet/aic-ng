import {Pipe, PipeTransform} from '@angular/core';
import {Model} from '../models/model';


@Pipe({name: 'timeSpan'})
export class TimeSpanPipe implements PipeTransform {

  transform(seconds: number): string {
    let s = '';
    if (isNaN(seconds) || seconds < 0) {
      return s;
    }

    if (seconds > 3600) {
      const hours = Math.round(seconds / 3600);
      s += hours + '小时';
      seconds = seconds % 3600;
    }
    if (seconds > 60) {
      const minutes = Math.round(seconds / 60);
      s += minutes + '分';
      seconds = seconds % 60;
    }
    s += Math.round(seconds) + '秒';
    return s;
  }
}
