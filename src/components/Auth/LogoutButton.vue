<!-- LogoutButton.vue -->
<template>
    <button @click="logout">Logout</button>
</template>
  
<script>
import AuthServiceVue from '../../services/AuthService.vue';
import { resetAllStores } from '../../utils/reset-stores';

export default {
    methods: {
        async logout() {
            const _this = this
            AuthServiceVue.logout() // Adjust the URL as needed
                .then(() => {
                    resetAllStores.resetAllStores()
                    _this.$router.push({ path: '/app/auth/login' })
                })
                .catch(error => {
                    console.error(error);
                });
        },
    },
};
</script>