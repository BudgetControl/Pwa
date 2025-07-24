<template>
  <div id="app">
    <!-- Il tuo template -->
    <div v-if="!networkStore.isOnline" class="offline-message flex flex-col items-center justify-center">
      <p><img :src="logo" alt="Budget Control" class="logo mb-4" width="80px" /></p>
      <p class="text-center">{{ $t('messages.offline') }}</p>
    </div>
    <div v-if="showInstallMessage" id="alert-message">
      <p>{{ $t('messages.install') }}</p>
      <button @click="installPWA">{{ $t('labels.install') }}</button>
      <button @click="closeAlert">{{ $t('labels.close') }}</button>
    </div>
    <router-view />
  </div>
  <UserNotificationPopUp />
</template>

<script>

import { libs } from './libs';
import { useNetworkStore } from './storage/network';
import { useNotificationStore } from './storage/notification.store';
import logo from '@/assets/img/icon-192.png';
import UserNotificationPopUp from './components/Comunications/UserNotificationPopUp.vue';
import { onMounted, onUnmounted, ref } from 'vue';
import { PushNotifications } from '@capacitor/push-notifications';
import NotificationService from './services/notification.service';

export default {
  components: {
    UserNotificationPopUp,
  },
  data() {
    return {
      logo,
      deferredPrompt: null,
      showInstallMessage: false,
      selectedLanguage: 'en',
      languages: {
        en: 'English',
        it: 'Italiano',
        sp: 'Español',
      },
    };
  },
  setup() {
    const networkStore = useNetworkStore();
    const notificationStore = useNotificationStore();
    const notificationService = new NotificationService();
    const isPushSupported = ref(false);

    // Funzione per inviare il token al backend
    const sendTokenToServer = (token) => {
      notificationService.savePushToken(token);
      console.log('Token inviato al backend:', token);
    };

    // Listener per ricezione notifica push
    const handleNotification = (notification) => {
      // Salva la notifica nello store
      const message = notification.data?.message || '';
      notificationStore.setNewMessage(message);
    };

    let removeListeners = null;

    onMounted(async () => {
      let isSupported = false;
      try {
        const result = await PushNotifications.isSupported();
        isSupported = result.isSupported;
      } catch (e) {
        isSupported = false;
      }
      isPushSupported.value = isSupported;

      if (isSupported) {
        const permission = await PushNotifications.requestPermissions();
        if (permission.receive === 'granted') {
          const { token } = await PushNotifications.register();
          sendTokenToServer(token.value);
        }
        PushNotifications.addListener('notification', handleNotification);
        PushNotifications.addListener('registration', (registration) => {
          // Puoi gestire la registrazione qui se serve
        });
        // Funzione di cleanup
        removeListeners = () => {
          PushNotifications.removeAllListeners();
        };
      }
    });

    onUnmounted(() => {
      if (removeListeners) removeListeners();
    });

    return { networkStore };
  },
  async created() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
    });

    const browserLanguage = navigator.language.split('-')[0];
    if (this.languages[browserLanguage]) {
      this.selectedLanguage = browserLanguage;
      this.changeLanguage();
    }

    const isAndroid = await libs.isAndroidPlatform();
    const isAppInstalled = await libs.isAppInstalled();

    if (isAndroid && !isAppInstalled) {
      this.showInstallMessage = true;
    }

  },
  // ...rimosso, ora gestito in setup con Composition API...
  methods: {
    closeAlert() {
      this.showInstallMessage = false;
    },
    changeLanguage() {
      this.$i18n.locale = this.selectedLanguage;
    },
    installPWA() {
      // Reindirizza al Play Store
      const urlToPlayStore = process.env.VUE_APP_GOOGLE_PLAY_STORE_URL;
      window.location.href = urlToPlayStore;
    },
  },
};
</script>

<style scoped>
.offline-message {
  background-color: #000;
  color: #fff;
  text-align: center;
  padding: 10px;
  font-weight: bold;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  opacity: 0.9;
}
</style>