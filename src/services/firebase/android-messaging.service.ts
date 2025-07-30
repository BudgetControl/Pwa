import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { useNotificationStore } from '../../storage/notification.store';
import {IFirebaseMessagingService, IAppState} from './firebaseMessaging.interface';

// Implementazione per Android (Capacitor Native)
class AndroidFirebaseMessagingService implements IFirebaseMessagingService {
  private currentToken: string | null = null;
  private notificationStore = useNotificationStore();
  private state : IAppState;

  constructor(state : IAppState) {
    this.state = state;
  }

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
      this.state.notificationState.isEnabled = true;
      this.state.notificationState.error = null;
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

  async getToken(): Promise<string | null> {
    if(!this.currentToken) {
        const result = await FirebaseMessaging.getToken();
        this.currentToken = result.token;
    }
    return this.currentToken;
  }

  async cleanup(): Promise<void> {
    await FirebaseMessaging.removeAllListeners();
  }

  // Callback handlers
  private onTokenReceived(token: string): void {
    console.log('🔥 Token ricevuto Android:', token);

    this.state.notificationState.token = token;
    this.state.notificationState.isEnabled = true;
    this.state.notificationState.error = null;

    this.notificationStore.setToken(token);
  }

  private onNotificationReceived(notification: any): void {
    console.log('📱 Notifica ricevuta Android:', notification);
    
    const message = notification.notification?.body || 
                   notification.body || 
                   notification.data?.message || 
                   'Nuova notifica';
    
    this.notificationStore.set(message);
  }

  private onNotificationActionPerformed(action: any): void {
    console.log('👆 Azione notifica Android:', action);
    this.handleNotificationAction(action);
  }

  private handleNotificationAction(action: any): void {
    if (action.notification?.data?.page) {
      // Gestisci navigazione o altre azioni
      console.log('Navigazione richiesta:', action.notification.data.page);
    }
  }

    getState(): IAppState {
        return this.state;
    }
}

export default AndroidFirebaseMessagingService;