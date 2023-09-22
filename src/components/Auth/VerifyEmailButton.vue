<!-- LogoutButton.vue -->
<template>
    <button @click="verify">Send me verify link</button>
</template>
  
<script>
import AuthServiceVue from '../../services/AuthService.vue';

export default {
    props: {
        email: {
            type: String
        },
    },
    methods: {
        async verify() {
            const email = this.email
            AuthServiceVue.verify(email) // Adjust the URL as needed
                .catch(error => {
                    console.error(error);
                });
        },
    },
};
</script>