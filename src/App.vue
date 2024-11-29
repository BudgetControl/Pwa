<template>
  <div id="app">
    <!-- Il tuo template -->
    <div v-if="showInstallMessage" id="alert-message">
      <p>Installa la nostra app dal Play Store!</p>
      <button @click="installPWA">Installa</button>
      <button @click="closeAlert">Chiudi</button>
    </div>
    <router-view />
  </div>
</template>

<script>
import { libs } from './libs';

export default {
  data() {
    return {
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
</style>