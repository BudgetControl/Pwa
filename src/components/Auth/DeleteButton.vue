<!-- LogoutButton.vue -->
<template>
    <button class="bg-red-500 text-white p-3 rounded" @click="deleteAllData">DELETE USER AND ALL DATA!</button>
</template>
  
<script>
import AuthService from '../../services/auth.service';
import { resetAllStores } from '../../utils/reset-stores';
import { getHeaderTokens } from '../../utils/headers-token';

export default {
    methods: {
        async deleteAllData() {
            const _this = this
            const header = getHeaderTokens()
            const authService= new AuthService()
            if(confirm("Are you sure you want to delete user ? All data and your user wil be deleted")) {
                authService.deleteUser()
                .then(() => {
                    resetAllStores.resetAllStores()
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