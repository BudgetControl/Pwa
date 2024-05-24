<template>
  <div class="e" id="app">
    <button v-if="deferredPrompt" @click="installPWA" class="install-button">Install APP</button>
    <router-view />
  </div>
</template>

<script>
import AuthService from './services/AuthService.vue';

export default {
  data() {
    return {
      deferredPrompt: null
    };
  },
  mounted: async function () {
    const _this = this
    // first check if user is logged
        AuthService.userInfo().then(() => {
          _this.$router.push('/dashboard');
        }).catch(() => {
          _this.$router.push({path : '/app/auth/login'});
        });
  },
  created() {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e;
      // Optionally, update your UI to notify the user they can install the PWA
      console.log('beforeinstallprompt event was fired.');
    });
  },
  methods: {
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

<style>
.install-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px 20px;
  background-color: #4DBA87;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  z-index: 9999;
}
</style>