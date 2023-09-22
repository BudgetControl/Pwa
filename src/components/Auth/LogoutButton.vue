<!-- LogoutButton.vue -->
<template>
    <button @click="logout">Logout</button>
</template>
  
<script>
import AuthServiceVue from '../../services/AuthService.vue';

export default {
    methods: {
        async logout() {
            const _this = this
            AuthServiceVue.logout() // Adjust the URL as needed
                .then(() => {
                    localStorage.clear()
                    _this.$router.push({ path: '/' })
                })
                .catch(error => {
                    console.error(error);
                });
        },
    },
};
</script>