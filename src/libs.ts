import { Capacitor } from '@capacitor/core';

class Libs {
   generateRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

   async isAndroidPlatform() {
    const info = await Capacitor.getPlatform();
    console.debug('isAndroidPlatform', info);
    return info === 'android';
  }

   async isIosPlatform() {
    const info = await Capacitor.getPlatform();
    console.debug('isIosPlatform', info);
    return info === 'ios';
  }

   async isAppInstalled(): Promise<boolean> {
    const info = Capacitor.isNativePlatform()
    console.debug('isAppInstalled', info);
    return info;
  }

  async isMobile(): Promise<boolean> {
    const platform = await Capacitor.getPlatform();
    const aspectRatio = window.innerWidth / window.innerHeight;
    const isMobile = platform === 'android' || platform === 'ios' || aspectRatio < 1.6;
    console.debug('isMobile', isMobile);
    return isMobile;
  }
}

export const libs = new Libs();