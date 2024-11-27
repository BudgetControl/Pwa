<!-- LogoutButton.vue -->
<template>
    <button @click="logout">Logout</button>
</template>
  
<script>
import AuthService from '../../services/auth.service';
import { resetAllStores } from '../../utils/reset-stores';

export default {
    methods: {
        async logout() {
            const authService = new AuthService()
            authService.logout()
            resetAllStores()
            this.$router.push({ path: '/app/auth/login' })
        },
    },
};
</script>