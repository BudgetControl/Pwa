<!-- LogoutButton.vue -->
<template>
    <button @click="logout">Logout</button>
</template>
  
<script>
import AuthServiceVue from '../../services/AuthService.vue';
import LocalStorageService from '../../services/LocalStorageService.vue';

export default {
    methods: {
        async logout() {
            const _this = this
            AuthServiceVue.logout() // Adjust the URL as needed
                .then(() => {
                    LocalStorageService.clear()
                    _this.$router.push({ path: '/app/auth/login' })
                })
                .catch(error => {
                    console.error(error);
                });
        },
    },
};
</script>