import { Device } from '@capacitor/device';
import { Capacitor } from '@capacitor/core';

class Libs {
   generateRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

   async isAndroidPlatform() {
    const info = await Device.getInfo();
    console.debug('isAndroidPlatform', info.platform);
    return info.platform === 'android';
  }

   async isIosPlatform() {
    const info = await Device.getInfo();
    console.debug('isIosPlatform', info.platform);
    return info.platform === 'ios';
  }

   async isAppInstalled(): Promise<boolean> {
    const info = Capacitor.isNativePlatform()
    console.debug('isAppInstalled', info);
    return info;
  }
}

export const libs = new Libs();