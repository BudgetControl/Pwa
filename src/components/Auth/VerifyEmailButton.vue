<!-- LogoutButton.vue -->
<template>
    <div>
        <span v-if="message">We have just sended an email</span>
        <button @click="verify">Send me verify link</button>
    </div>
</template>
  
<script>
import AuthService from '../../services/auth.service';

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
            const authService = new AuthService()

            authService.verify(email) // Adjust the URL as needed
                .catch(error => {
                    console.error(error);
                });
        },
    },
};
</script>