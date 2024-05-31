<template>
  <div class="e" id="app">
    <div  v-if="deferredPrompt" id="alert-message"  class="text-white px-6 py-4 border-0 rounded relative mb-4 bg-lightBlue-500">
      <span class="inline-block align-middle mr-8">
        <b class="capitalize">{{ $t('text.install_app') }}
      <button @click="installPWA">{{ $t('labels.click_here') }}</button>
      </span>
      <button
        v-on:click="closeAlert()"
        class="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none">
        <span>×</span>
      </button>
    </div>
    <router-view />
  </div>
</template>

<script>
import AuthService from './services/AuthService.vue';

export default {
  data() {
    return {
      deferredPrompt: null,
      selectedLanguage: this.$i18n.locale,
      languages: {
        en: 'English',
        es: 'Spanish',
        it: 'Italian',
      }
    };
  },
  mounted: async function () {
    const _this = this
    // first check if user is logged
    AuthService.userInfo().then(() => {
      _this.$router.push('/dashboard');
    }).catch(() => {
      _this.$router.push({ path: '/app/auth/login' });
    });
  },
  created() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
    });
  },
  methods: {
    closeAlert: function(){
      this.deferredPrompt = false;
    },
    changeLanguage() {
      this.$i18n.locale = this.selectedLanguage;
    },
    installPWA() {
      if (this.deferredPrompt) {
        this.deferredPrompt.prompt();
        this.deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
          } else {
            console.log('User dismissed the A2HS prompt');
          }
          this.deferredPrompt = null;
        });
      }
    }
  },
}
</script>

<style scoped>
#alert-message {
  z-index: 9999;
}
</style>