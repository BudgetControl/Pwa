<!-- LogoutButton.vue -->
<template>
    <button @click="logout">Logout</button>
</template>
  
<script>
import { AuthService } from '../../services/auth.service';
import { resetAllStores } from '../../utils/reset-stores';
import { getHeaderTokens } from '../../utils/headers-token';

export default {
    methods: {
        async logout() {
            const _this = this
            const header = getHeaderTokens()
            const authService = new AuthService(header)

            authService.logout() // Adjust the URL as needed
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