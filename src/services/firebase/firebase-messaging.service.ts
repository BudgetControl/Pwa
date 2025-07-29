import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { Capacitor } from '@capacitor/core';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';
import { onMounted, onUnmounted, reactive } from 'vue';
import NotificationService from '../notification.service';
import { useNotificationStore } from '../../storage/notification.store';
import IFirebaseMessagingService from './firebaseMessaging.interface';

const firebaseConfig = {
  apiKey: "AIzaSyCPDnvLyV99zd5zTW5zwEprqXqNGYvDHvs",
  authDomain: "budgetcontrol-d1201.firebaseapp.com",
  projectId: "budgetcontrol-d1201",
  storageBucket: "budgetcontrol-d1201.firebasestorage.app",
  messagingSenderId: "875376524328",
  appId: "1:875376524328:android:3d662c80fccce58ef0491d"
};

const state = reactive({
  deferredPrompt: null,
  showInstallMessage: false,
  showNotificationStatus: false,
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



// Implementazione per Android (Capacitor Native)
class AndroidFirebaseMessagingService implements IFirebaseMessagingService {
  private currentToken: string | null = null;
  private notificationStore = useNotificationStore();
  private service = new NotificationService();

  async initialize(): Promise<void> {
    console.log('🔥 Inizializzazione Firebase Messaging Android');

    // Rimuovi listener esistenti
    await FirebaseMessaging.removeAllListeners()
    
    // Aggiungi listener per il token
    await FirebaseMessaging.addListener('tokenReceived', (event) => {
      console.log('🔥 Token ricevuto via listener:', event.token);
      this.currentToken = event.token;
      this.onTokenReceived(event.token);
    });

    // Listener per notifiche ricevute
    await FirebaseMessaging.addListener('notificationReceived', (event) => {
      console.log('🔥 Notifica ricevuta:', event);
      this.onNotificationReceived(event);
    });

    // Listener per azioni su notifiche
    await FirebaseMessaging.addListener('notificationActionPerformed', (event) => {
      console.log('🔥 Azione notifica:', event);
      this.onNotificationActionPerformed(event);
    });

    // Richiedi permessi
    const permissions = await FirebaseMessaging.requestPermissions();
    console.log('🔥 Permessi Android:', permissions);

    if (permissions.receive === 'granted') {
      console.log('✅ Permessi concessi, in attesa del token via listener...');
      state.notificationState.isEnabled = true;
      state.notificationState.error = null;
    } else {
      throw new Error('Permessi per le notifiche non concessi su Android');
    }
  }

  async subscribeToTopic(topic: string): Promise<void> {
    try {
      await FirebaseMessaging.subscribeToTopic({ topic });
      console.log(`🔥 Android: Iscritto al topic: ${topic}`);
    } catch (error) {
      console.error('🔥 Errore iscrizione topic Android:', error);
    }
  }

  async unsubscribeFromTopic(topic: string): Promise<void> {
    try {
      await FirebaseMessaging.unsubscribeFromTopic({ topic });
      console.log(`🔥 Android: Disiscritto dal topic: ${topic}`);
    } catch (error) {
      console.error('🔥 Errore disiscrizione topic Android:', error);
    }
  }

  getToken(): string | null {
    return this.currentToken;
  }

  async cleanup(): Promise<void> {
    await FirebaseMessaging.removeAllListeners();
  }

  // Callback handlers
  private onTokenReceived(token: string): void {
    console.log('🔥 Token ricevuto Android:', token);

    state.notificationState.token = token;
    state.notificationState.isEnabled = true;
    state.notificationState.error = null;
    
    this.notificationStore.setToken(token);
    this.sendTokenToServer(token);
  }

  private onNotificationReceived(notification: any): void {
    console.log('📱 Notifica ricevuta Android:', notification);
    
    const message = notification.notification?.body || 
                   notification.body || 
                   notification.data?.message || 
                   'Nuova notifica';
    
    this.notificationStore.setNewMessage(message);
  }

  private onNotificationActionPerformed(action: any): void {
    console.log('👆 Azione notifica Android:', action);
    this.handleNotificationAction(action);
  }

  private async sendTokenToServer(token: string): Promise<void> {
    try {
      const response = await this.service.savePushToken(token);

      if (response.ok) {
        console.log('✅ Token Android inviato al server');
      }
    } catch (error) {
      console.error('❌ Errore invio token Android al server:', JSON.stringify(error));
    }
  }

  private handleNotificationAction(action: any): void {
    if (action.notification?.data?.page) {
      // Gestisci navigazione o altre azioni
      console.log('Navigazione richiesta:', action.notification.data.page);
    }
  }
}

// Implementazione per Browser (Web)
class BrowserFirebaseMessagingService implements IFirebaseMessagingService {
  private messaging: any;
  private currentToken: string | null = null;
  private notificationStore = useNotificationStore();
  private service = new NotificationService();

  async initialize(): Promise<void> {
    console.log('🔥 Inizializzazione Firebase Messaging Browser');

    // Inizializza Firebase per il web
    const app = initializeApp(firebaseConfig);
    this.messaging = getMessaging(app);

    // Registra service worker (opzionale)
    let registration;
    if ('serviceWorker' in navigator) {
      try {
        registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('🔥 Service Worker registrato:', registration);
      } catch (error) {
        console.warn('⚠️ Service Worker non registrato:', error);
      }
    }

    // Richiedi permessi
    const permission = await Notification.requestPermission();
    console.log('🔥 Permessi notifiche browser:', permission);

    if (permission === 'granted') {
      // Ottieni token
      const token = await getToken(this.messaging, {
        vapidKey: process.env.VUE_APP_VAPID_KEY,
        serviceWorkerRegistration: registration
      });

      if (token) {
        console.log('🔥 Token FCM ricevuto browser:', token);
        this.currentToken = token;
        this.onTokenReceived(token);
      } else {
        throw new Error('Impossibile ottenere il token per il browser');
      }

      // Listener per messaggi in foreground
      onMessage(this.messaging, (payload) => {
        console.log('🔥 Messaggio ricevuto in foreground browser:', payload);
        this.onNotificationReceived(payload);
      });

      state.notificationState.isEnabled = true;
      state.notificationState.error = null;
    } else {
      throw new Error('Permessi per le notifiche non concessi nel browser');
    }
  }

  async subscribeToTopic(topic: string): Promise<void> {
    // Per il web, la sottoscrizione ai topic deve essere gestita lato server
    console.log(`🔥 Browser: Sottoscrizione al topic ${topic} deve essere gestita lato server`);
  }

  async unsubscribeFromTopic(topic: string): Promise<void> {
    // Per il web, la disiscrizione dai topic deve essere gestita lato server
    console.log(`🔥 Browser: Disiscrizione dal topic ${topic} deve essere gestita lato server`);
  }

  getToken(): string | null {
    return this.currentToken;
  }

  async cleanup(): Promise<void> {
    // Non ci sono listener specifici da rimuovere per il web
    console.log('🔥 Cleanup browser completato');
  }

  // Callback handlers
  private onTokenReceived(token: string): void {
    console.log('🔥 Token ricevuto browser:', token);
    state.notificationState.token = token;
    state.notificationState.isEnabled = true;
    state.notificationState.error = null;
    
    this.notificationStore.setToken(token);
    this.service.savePushToken(token);
    this.sendTokenToServer(token);
  }

  private onNotificationReceived(notification: any): void {
    console.log('📱 Notifica ricevuta browser:', notification);
    
    const message = notification.notification?.body || 
                   notification.body || 
                   notification.data?.message || 
                   'Nuova notifica';
    
    this.notificationStore.setNewMessage(message);

    // Mostra notifica locale se la pagina non è visibile
    if (document.hidden) {
      this.showLocalNotification(notification);
    }
  }

  private showLocalNotification(notification: any): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      const title = notification.notification?.title || 'Nuova notifica';
      const options = {
        body: notification.notification?.body || 'Hai ricevuto una nuova notifica',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        tag: 'app-notification',
        requireInteraction: false,
        data: notification.data
      };
      
      const notif = new Notification(title, options);
      
      notif.onclick = () => {
        window.focus();
        notif.close();
        this.handleNotificationAction({ notification });
      };
    }
  }

  private async sendTokenToServer(token: string): Promise<void> {
    try {
      const response = await this.service.savePushToken(token);

      if (response.ok) {
        console.log('✅ Token browser inviato al server');
      }
    } catch (error) {
      console.error('❌ Errore invio token browser al server:', error);
    }
  }

  private handleNotificationAction(action: any): void {
    if (action.notification?.data?.page) {
      // Gestisci navigazione o altre azioni
      console.log('Navigazione richiesta:', action.notification.data.page);
    }
  }
}

// Factory per creare il servizio appropriato
class FirebaseMessagingService {
  private service: IFirebaseMessagingService;

  constructor() {
    if (Capacitor.isNativePlatform()) {
      console.log('🔥 Creazione servizio Android');
      this.service = new AndroidFirebaseMessagingService();
    } else {
      console.log('🔥 Creazione servizio Browser');
      this.service = new BrowserFirebaseMessagingService();
    }
  }

  async initialize(): Promise<void> {
    return this.service.initialize();
  }

  getToken(): string | null {
    return this.service.getToken();
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
      
      // Mostra status per qualche secondo
      state.showNotificationStatus = true;
      setTimeout(() => {
        state.showNotificationStatus = false;
      }, 5000);

    } catch (error) {
      console.error('💥 Errore inizializzazione notifiche:', error);
      state.notificationState.error = error instanceof Error ? error.message : String(error);
      state.notificationState.isEnabled = false;
      
      // Mostra errore
      state.showNotificationStatus = true;
      setTimeout(() => {
        state.showNotificationStatus = false;
      }, 8000);
    }
  }
}

export default FirebaseMessagingService;
export { state };
