export class Result {

  // 成功
  static CODE_SUCCESS = 0;

  // 未登录
  static CODE_NOT_AUTHENTICATED = 102;

  // 无操作权限
  static CODE_NOT_AUTHORIZED = 103;

  // 禁止操作
  static CODE_FORBIDDEN = 104;

  static GENERAL_FAILURE_MESSAGE = '操作失败';

  code: number;
  message?: string;

}

export class ValueResult<T> extends Result {

  value?: T;

}

export class ListResult<T> extends Result {

  list?: T[];

}
