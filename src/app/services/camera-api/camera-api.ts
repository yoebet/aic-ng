import {
  AddTemplatesResult, ApiResponse,
  CallbacksConfig, CameraImg,
  CheckRecord,
  ResponseTemplate,
  StringResponse,
  TemplateInfo
} from './api-response';
import {RequestTemplate, RequestTemplate2} from './api-request';
import {DeviceConfig} from './device-config';


function debug(obj) {
  console.log(obj);
}


export default class CameraApi {
  apiBase: string;
  deviceNo: string;

  constructor(apiBase: string, deviceNo: string) {
    this.apiBase = apiBase;
    this.deviceNo = deviceNo;
  }

  // 2.1 获取设备序列号
  async requestDeviceNo(): Promise<StringResponse> {

    // curl -X POST -H "deviceserial:warmnut.com" http://xxx:8809/get_device
    const response = await fetch(this.apiBase + '/get_device',
      {
        method: 'POST',
        headers: {deviceserial: 'warmnut.com'}
      });
    const sr = await response.json() as StringResponse;
    debug(sr);
    // { errorCode: 200, errorMsg: '', data: 'DBF6PGEGPK' }
    if (sr.errorCode === ApiResponse.OK) {
      this.deviceNo = sr.data;
    }
    return sr;
  }

  private post(uri: string): Promise<Response> {
    return fetch(this.apiBase + uri,
      {
        method: 'POST',
        headers: {deviceserial: this.deviceNo}
      });
  }

  private async simplePost(uri: string): Promise<StringResponse> {
    const response = await this.post(uri);
    const sr = await response.json() as StringResponse;
    debug(sr);
    return sr;
  }

  private postForm(uri: string, body: unknown): Promise<Response> {
    return fetch(this.apiBase + uri,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {deviceserial: this.deviceNo}
      });
  }

  private async simplePostForm(uri: string, body: unknown): Promise<StringResponse> {
    const response = await this.postForm(uri, body);
    const sr = await response.json() as StringResponse;
    debug(sr);
    return sr;
  }

  // 2.2 初始化屏幕位置
  async initScreen(): Promise<StringResponse> {
    return this.simplePost('/init_screen');
  }

  // 2.3 获取采集模板
  async getCollection(): Promise<ApiResponse<ResponseTemplate>> {
    const response = await fetch(this.apiBase + '/get_collection',
      {
        method: 'POST',
        headers: {deviceserial: this.deviceNo}
      });
    const sr = await response.json() as ApiResponse<ResponseTemplate>;
    debug(sr);
    // { errorCode: 200, errorMsg: '', data: '' }

    return sr;
  }

  // 2.4 添加采集模板
  async addTemplate(temps: RequestTemplate[]): Promise<ApiResponse<AddTemplatesResult>> {
    const response = await fetch(this.apiBase + '/add_template',
      {
        method: 'POST',
        body: JSON.stringify(temps),
        headers: {
          deviceserial: this.deviceNo,
          'Content-Type': 'application/json'
        }
      });
    const sr = await response.json() as ApiResponse<AddTemplatesResult>;
    debug(sr);
    // { errorCode: 200, errorMsg: '', data: '' }

    return sr;
  }

  // 2.5 添加采集模板 2
  async addTemplate2(temps: RequestTemplate2[]): Promise<ApiResponse<AddTemplatesResult>> {
    const response = await fetch(this.apiBase + '/add_template',
      {
        method: 'POST',
        body: JSON.stringify(temps),
        headers: {
          deviceserial: this.deviceNo,
          'Content-Type': 'application/json'
        }
      });
    const sr = await response.json() as ApiResponse<AddTemplatesResult>;
    debug(sr);
    // { errorCode: 200, errorMsg: '', data: '' }

    return sr;
  }

  // 2.6 初始化比对模板
  async initCheckTemplate(): Promise<StringResponse> {
    return this.simplePost('/init_check_template');
  }

  // 2.7 切换模板
  async switchTemplate(): Promise<StringResponse> {
    return this.simplePost('/switch_template');
  }

  // 2.8 设置比对失败上传接口
  async setFailCallback(url: string): Promise<StringResponse> {

    return this.simplePostForm('/set_fail_callback', {url});
  }

  // 2.9 比对失败上传 （callback）

  // 2.10 设置比对成功上传接口
  async setSuccessCallback(url: string): Promise<StringResponse> {

    return this.simplePostForm('/set_success_callback', {url});
  }

  // 2.11 比对成功上传 （callback）

  // 2.12 设备配置信息
  async configUpdate(config: DeviceConfig): Promise<StringResponse> {

    return this.simplePostForm('/config_update', config);
  }

  // 2.13 获取设备配置信息
  async getConfig(): Promise<ApiResponse<DeviceConfig>> {

    const response = await this.post('/get_config');
    const sr = await response.json() as ApiResponse<DeviceConfig>;
    debug(sr);
    return sr;
  }

  // 2.14 获取所有回调接口
  async getCallbacks(): Promise<ApiResponse<CallbacksConfig>> {

    const response = await this.post('/get_callbacks');
    const sr = await response.json() as ApiResponse<CallbacksConfig>;
    debug(sr);
    return sr;
  }

  // 2.15 清除所有模板信息
  async delTemplate(): Promise<StringResponse> {
    return this.simplePost('/del_template');
  }

  // 2.16 清除所有比对记录
  async delRemark(): Promise<StringResponse> {
    return this.simplePost('/del_remark');
  }

  // 2.17 获取所有模板信息
  async getTemplate(): Promise<ApiResponse<TemplateInfo[]>> {

    const response = await this.post('/get_template');
    const sr = await response.json() as ApiResponse<TemplateInfo[]>;
    debug(sr);
    return sr;
  }

  // 2.18 获取所有比对记录
  async getRemark(): Promise<ApiResponse<CheckRecord[]>> {

    const response = await this.post('/get_remark');
    const sr = await response.json() as ApiResponse<CheckRecord[]>;
    debug(sr);
    return sr;
  }

  // 2.19 修改配置文件
  async setCfg(configFile: unknown): Promise<StringResponse> {
    return this.simplePostForm('/set_cfg', configFile);
  }

  // 2.20 获取配置文件信息
  async getCfg(): Promise<ApiResponse<unknown>> {

    const response = await this.post('/get_cfg');
    const sr = await response.json() as ApiResponse<unknown>;
    debug(sr);
    return sr;
  }

  // 2.21 获取摄像头实时画面
  async getCameraImg(): Promise<ApiResponse<CameraImg>> {

    const response = await this.post('/get_camera_img');
    const sr = await response.json() as ApiResponse<CameraImg>;
    debug(sr);
    return sr;
  }


}

