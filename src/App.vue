<template>
  <div id="app">
    <!-- Il tuo template -->
    <div v-if="!networkStore.isOnline" class="offline-message flex flex-col items-center justify-center">
      <p><img :src="logo"class="logo mb-4" width="80px" /></p>
      <p class="text-center">{{$t('messages.offline')}}</p>
    </div>
    <div v-if="showInstallMessage" id="alert-message">
      <p>{{ $t('messages.install') }}</p>
      <button @click="installPWA">{{$t('labels.install')}}</button>
      <button @click="closeAlert">{{$t('labels.close')}}</button>
    </div>
    <router-view />
  </div>
</template>

<script>
import { libs } from './libs';
import { useNetworkStore } from './storage/network';
import logo from '@/assets/img/icon-192.png';

export default {
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
#alert-message {
  /* Stili per il messaggio di installazione */
}
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