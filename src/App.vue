<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import AuthService from './services/AuthService.vue';

export default {
  mounted: async function () {
    const _this = this
    // first check if user is logged
        AuthService.userInfo().then(() => {
          _this.$router.push('/dashboard');
        }).catch(() => {
          _this.$router.push({path : '/app/auth/login'});
        });
  },
}
</script>