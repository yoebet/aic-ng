export class ApiResponse<T> {
  static OK = 200;

    errorCode?: number;
    errorMsg?: string;
    data?: T;

    //  200 OK
    //  404 Not Found
    // -100 sdk 未激活
    // -200 初始化屏幕失败或未初始化屏幕
    // -300 未找到设备(设备序列号错误)
    // -302 设置模板出错
    // -303 设置比对失败回调接口出错
    // -304 设置比对成功回调接口出错
    // -305 模板出错
    // -306 获取模板照片出错
    // -307 获取图片地址出错
    // -308 获取视频地址出错
}

export class StringResponse extends ApiResponse<string> {

}


export class ResponseTemplate {
    temp?: string;
    param?: number[];

    // "data": {
    //     "temp": "/image/a.png", // 模板图片 http://0.0.0.0:8809/image/a.png
    //     "param": [] // float 数组，模板提取的特征点
    // }
}

export class AddTemplatesResult {
    deviceSerial?: string;
    success?: { collectionId: string }[];
    fail?: { collectionId: string }[];
}

export class CallbacksConfig {
    checkSuccessTemplate?: string;
    checkFailTemplate?: string;
}

export class TemplateInfo {
    collectionId?: string; // 模板 id
    param?: number[];
    img?: string;
}

export class CheckRecord {
    id?: number;
    collectionId?: number;
    time?: number; // 162383962922
    checkStatus?: boolean;
    isUpdate?: boolean;

    // if checkStatus=false

    path1?: string;
    path2?: string;
}


export class CameraImg {
    img1?: string;
    img2?: string;
    img3?: string;
}
