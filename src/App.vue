<template>
  <div class="e" id="app">
    <div  v-if="deferredPrompt"  class="text-white px-6 py-4 border-0 rounded relative mb-4 bg-lightBlue-500">
      <span class="inline-block align-middle mr-8">
        <b class="capitalize">Hey!</b> Install our app to get the best experience.
      <button @click="installPWA">Click Here</button>
      </span>
      <button
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
      deferredPrompt: null
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
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e;
      // Optionally, update your UI to notify the user they can install the PWA
      console.log('beforeinstallprompt event was fired.');
    });
  },
  methods: {
    closeAlert: function(){
      this.deferredPrompt = false;
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