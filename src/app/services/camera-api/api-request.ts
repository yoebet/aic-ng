export class RequestTemplate {

    collectionId: string; // 模板 id
    temp: string; // Base64 位图片
    params: number[]; // 模板特征值

    constructor(collectionId: string, temp: string, params: number[]) {
        this.collectionId = collectionId;
        this.temp = temp;
        this.params = params;
    }
}

export class RequestTemplate2 {

    collectionId: string; // 模板 id
    temp: string; // 下载图片地址
    params: number[]; // 采集 sdk 返回的数据集

    constructor(collectionId: string, temp: string, params: number[]) {
        this.collectionId = collectionId;
        this.temp = temp;
        this.params = params;
    }
}
