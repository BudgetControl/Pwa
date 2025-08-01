import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { useNotificationStore } from '../../storage/notification.store';
import { IFirebaseMessagingService, IAppState } from './firebaseMessaging.interface';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyCPDnvLyV99zd5zTW5zwEprqXqNGYvDHvs",
    authDomain: "budgetcontrol-d1201.firebaseapp.com",
    projectId: "budgetcontrol-d1201",
    storageBucket: "budgetcontrol-d1201.firebasestorage.app",
    messagingSenderId: "875376524328",
    appId: "1:875376524328:android:3d662c80fccce58ef0491d"
};

class BrowserFirebaseMessagingService implements IFirebaseMessagingService {
    private messaging: any;
    private currentToken: string | null = null;
    private notificationStore = useNotificationStore();
    private state: IAppState;

    constructor(state: IAppState) {
        this.state = state;
    }

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

            this.state.notificationState.isEnabled = true;
            this.state.notificationState.error = null;
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

    async getToken(): Promise<string | null> {
        if (!this.currentToken) {
            if (!this.messaging) {
                throw new Error('Firebase Messaging non inizializzato');
            }
            try {
                const token = await getToken(this.messaging, {
                    vapidKey: process.env.VUE_APP_VAPID_KEY,
                    serviceWorkerRegistration: this.serviceWorkerRegistration
                });
                this.currentToken = token;
            } catch (error) {
                console.error('Errore durante il recupero del token FCM:', error);
                return null;
            }
        }
        return this.currentToken;
    }

    async cleanup(): Promise<void> {
        // Non ci sono listener specifici da rimuovere per il web
        console.log('🔥 Cleanup browser completato');
    }

    // Callback handlers
    private onTokenReceived(token: string): void {
        console.log('🔥 Token ricevuto browser:', token);
        this.state.notificationState.token = token;
        this.state.notificationState.isEnabled = true;
        this.state.notificationState.error = null;

        this.notificationStore.setToken(token);
    }

    private onNotificationReceived(notification: any): void {
        console.log('📱 Notifica ricevuta browser:', notification);

        const message = notification.notification?.body ||
            notification.body ||
            notification.data?.message ||
            'Nuova notifica';

        this.notificationStore.isNewMessage = true;
        this.notificationStore.set({ title: notification.notification?.title || 'Nuova notifica', message });
        this.showLocalNotification(notification);
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

export default BrowserFirebaseMessagingService;