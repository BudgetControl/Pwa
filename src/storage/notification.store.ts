import { defineStore } from 'pinia';
import { ref, computed, onMounted } from 'vue';
import NotificationService from '../services/notification.service';

export const useNotificationStore = defineStore('notification', () => {
    const new_message = ref(false);
    const last_message = ref<string | null>(null);

    onMounted(() => {
        const notificationService = new NotificationService();
        setInterval(async () => {
            try {
                const lastMessage = await notificationService.getLastMessage();
                if (lastMessage && lastMessage.id) {
                    new_message.value = true;
                    last_message.value = lastMessage.content; // Assuming the message content is what you want to save
                } else {
                    new_message.value = false;
                }
            } catch (error) {
                console.error('Error fetching last message:', error);
            }
        }, 5000); // Check every 5 seconds
    });

    function setNewMessage(message: string) {
        new_message.value = true;
        last_message.value = message;
    }

    function getLastMessage(): string | null {
        return last_message.value;
    }

    function clearNewMessage() {
        new_message.value = false;
        last_message.value = null;
    }

    return {
        new_message,
        last_message,
        setNewMessage,
        getLastMessage,
        clearNewMessage,
        isNewMessage: computed(() => new_message.value)
    };
});