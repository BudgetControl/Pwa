<!-- LogoutButton.vue -->
<template>
    <button class="border border-red-500 rounded p-3" @click="deleteAllData">Delete user data!</button>
</template>
  
<script>
import AuthServiceVue from '../../services/AuthService.vue';


export default {
    methods: {
        async deleteAllData() {
            const _this = this
            if(confirm("Are you sure you want to delete data ? Only data wil be deleted")) {
                AuthServiceVue.deleteDataUser() // Adjust the URL as needed
                .then(() => {
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