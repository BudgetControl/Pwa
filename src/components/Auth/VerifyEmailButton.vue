<!-- LogoutButton.vue -->
<template>
    <div>
        <span v-if="message">We have just sended an email</span>
        <button @click="verify">Send me verify link</button>
    </div>
</template>
  
<script>
import AuthServiceVue from '../../services/AuthService.vue';

export default {
    data() {
        return {
            message: false
        }
    },
    props: {
        email: {
            type: String
        },
    },
    methods: {
        async verify() {
            const email = this.email
            this.message = true
            AuthServiceVue.verify(email) // Adjust the URL as needed
                .catch(error => {
                    console.error(error);
                });
        },
    },
};
</script>