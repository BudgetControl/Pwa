<!-- LogoutButton.vue -->
<template>
    <button class="bg-red-500 text-white p-3 rounded" @click="deleteAllData">DELETE USER AND ALL DATA!</button>
</template>
  
<script>
import AuthServiceVue from '../../services/AuthService.vue';
import LocalStorageService from '../../services/LocalStorageService.vue';

export default {
    methods: {
        async deleteAllData() {
            const _this = this
            if(confirm("Are you sure you want to delete user ? All data and your user wil be deleted")) {
                AuthServiceVue.deleteUser() // Adjust the URL as needed
                .then(() => {
                    LocalStorageService.clear()
                    _this.$router.push({ path: '/app/auth/login' })
                })
                .catch(error => {
                    console.error(error);
                });
            }
        },
    },
};
</script>