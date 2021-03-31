export class DeviceConfig {
    isPowerBoot?: boolean; // 是否开启开机自启动
    isGuard?: boolean; // 是否开启守护进程
    isReboot?: boolean; // 是否开启设备每日重启
    rebootHour?: number; // 设备每日重启小时(0-23)
    rebootMinute?: number; // 设备每日重启分钟(0-59)
    checkValue?: number; // 识别阈值(0-1)
}
