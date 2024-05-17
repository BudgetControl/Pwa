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
    AuthService.check().then((res) => {
      // if ok retrive user info
      if (res) {
        AuthService.userInfo().then(() => {
          _this.$router.push('/dashboard');
        })
      } else {
        // if not logged redirect to login
        _this.$router.push('/login');
      }
    }).catch((er) => {
      console.error(er)
      // if not logged redirect to login
      _this.$router.push({ path: '/app/auth' });
    })

  },
}
</script>