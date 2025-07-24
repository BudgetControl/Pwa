<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
    <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-8 flex flex-col items-center">
      <p class="text-gray-600 mb-6 text-center">{{ message }}</p>
      <button @click="close" class="text-gray-400 hover:text-gray-600 px-4 py-2 rounded">
        {{ $t('labels.close') }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { useNotificationStore } from '../../storage/notification.store';

export default {
  setup() {
    const notificationStore = useNotificationStore();
    const visible = ref(false);
    const message = ref('');

    watch(
      () => notificationStore.isNewMessage,
      (val) => {
        if (val) {
          visible.value = true;
          // Puoi recuperare il messaggio dallo store, qui esempio statico
          message.value = notificationStore.getNewMessage?.() || 'Hai una nuova notifica!';
        }
      }
    );

    function close() {
      visible.value = false;
      notificationStore.clearNewMessage();
    }

    return {
      visible,
      message,
      close
    };
  }
};
</script>