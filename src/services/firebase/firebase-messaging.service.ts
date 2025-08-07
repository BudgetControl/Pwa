import { Capacitor } from '@capacitor/core';
import { reactive } from 'vue';
import { IFirebaseMessagingService, IAppState } from './firebaseMessaging.interface';
import AndroidFirebaseMessagingService from './android-messaging.service';
import BrowserFirebaseMessagingService from './browser-messaging.service';
import NotificationService from '../notification.service';

const state: IAppState = reactive({
  deferredPrompt: null,
  showInstallMessage: false,
  selectedLanguage: 'en',
  languages: {
    en: 'English',
    it: 'Italiano',
    sp: 'Español',
  },
  notificationState: {
    isEnabled: false,
    token: '',
    error: null as string | null
  }
});

// Factory per creare il servizio appropriato
class FirebaseMessagingService {
  private service: IFirebaseMessagingService;

  constructor() {
    if (Capacitor.isNativePlatform()) {
      console.log('🔥 Creazione servizio Android');
      this.service = new AndroidFirebaseMessagingService(state);
    } else {
      console.log('🔥 Creazione servizio Browser');
      this.service = new BrowserFirebaseMessagingService(state);
    }
  }

  async initialize(): Promise<void> {
    return this.service.initialize();
  }

  async getToken(): Promise<string | null> {
    try {
      const token = await this.service.getToken();
      if (token) {
        await this.sendTokenToServer(token);
        state.notificationState.token = token;
        state.notificationState.isEnabled = true;
      } else {
        console.warn('⚠️ Token non disponibile');
        state.notificationState.isEnabled = false;
        state.notificationState.error = 'Token not available';
      }
    } catch (error) {
      console.error("Error getting Firebase token:", error);
      state.notificationState.error = error instanceof Error ? error.message : String(error);
      state.notificationState.isEnabled = false;
    }
    return Promise.resolve(state.notificationState.token);
  }

  async cleanup(): Promise<void> {
    return this.service.cleanup();
  }

  async subscribeToTopic(topic: string): Promise<void> {
    return this.service.subscribeToTopic(topic);
  }

  async unsubscribeFromTopic(topic: string): Promise<void> {
    return this.service.unsubscribeFromTopic(topic);
  }

  // Metodo pubblico per inizializzare le notifiche (utilizzato nel componente)
  async initializeNotifications(): Promise<void> {
    try {
      console.log('🚀 Inizializzazione notifiche...');

      await this.initialize();

    } catch (error) {
      console.error('💥 Errore inizializzazione notifiche:', error);
      state.notificationState.error = error instanceof Error ? error.message : String(error);
      state.notificationState.isEnabled = false;

    }
  }

  private async sendTokenToServer(token: string): Promise<void> {
    try {
      const service = new NotificationService();
      const response = await service.savePushToken(token);

      if (response.ok) {
        console.log('✅ Token Android inviato al server');
      }
    } catch (error) {
      console.error('❌ Errore invio token Android al server:', JSON.stringify(error));
    }
  }

  getState(): IAppState {
    return this.service.getState();
  }
}

export default FirebaseMessagingService;
