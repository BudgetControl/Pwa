import { defineStore } from 'pinia';
import { ref, computed, onMounted } from 'vue';
import NotificationService from '../services/notification.service';

export const useNotificationStore = defineStore('notification', () => {
    const new_message = ref(false);

    onMounted(() => {
        const notificationService = new NotificationService();
        setInterval(async () => {
            try {
                const lastMessage = await notificationService.getLastMessage();
                if (lastMessage && lastMessage.id) {
                    new_message.value = true;
                } else {
                    new_message.value = false;
                }
            } catch (error) {
                console.error('Error fetching last message:', error);
            }
        }, 5000); // Check every 5 seconds
    });

    function setNewMessage(value: boolean) {
        new_message.value = value;
    }

    function getNewMessage(): boolean {
        return new_message.value;
    }

    function clearNewMessage() {
        new_message.value = false;
    }

    return {
        new_message,
        setNewMessage,
        getNewMessage,
        clearNewMessage,
        isNewMessage: computed(() => new_message.value)
    };
});