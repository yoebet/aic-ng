import {Model} from './model';

export class ProductTest extends Model {
  cameraId: number;
  operatorId: number; // user.id

  produceModel?: string;
  produceNo?: string;

  expectTotalTime: number; // seconds
  operationInterval: number; // seconds

  testStartedAt: Date;
  testCompletedAt: Date;

  testResult: string; // P: 合格；R: 不合格
  status: string; // I: 未开始；R: 进行中；C: 取消；D: 完成

  //

  cameraLabel?: string;
  cameraApiBase?: string;
  operatorName?: string;
}
