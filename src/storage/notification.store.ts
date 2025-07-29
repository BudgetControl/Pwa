import { defineStore } from 'pinia';
import { ref, computed, onMounted } from 'vue';

export const useNotificationStore = defineStore('notification', () => {
    const token = ref('');
    const isEnabled = ref(false);
    const error = ref(null);
    const message = ref(null);

    // Imposta il token di notifica
    function setToken(newToken: string) {
        token.value = newToken;
        isEnabled.value = true;
        error.value = null;
    }

    function setNewMessage(newMessage) {
        message.value = newMessage;
    }

    // Ottieni lo stato delle notifiche
    const notificationState = computed(() => ({
        token: token.value,
        isEnabled: isEnabled.value,
        error: error.value,
    }));

    return {
        token,
        isEnabled,
        error,
        setToken,
        notificationState,
        setNewMessage,
    };
});