<!-- LogoutButton.vue -->
<template>
    <button @click="deleteAllData">Delete user and all data!</button>
</template>
  
<script>
import AuthServiceVue from '../../services/AuthService.vue';
import LocalStorageService from '../../services/LocalStorageService.vue';

export default {
    methods: {
        async deleteAllData() {
            const _this = this
            if(confirm("Are you sure you want to delete user ? All data wil be deleted")) {
                AuthServiceVue.deleteUser() // Adjust the URL as needed
                .then(() => {
                    LocalStorageService.clear()
                    _this.$router.push({ path: '/' })
                })
                .catch(error => {
                    console.error(error);
                });
            }
        },
    },
};
</script>