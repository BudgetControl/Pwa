<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
    <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-8 flex flex-col items-center">
      <h2 class="text-xl font-semibold mb-4">{{ title }}</h2>
      <p class="text-gray-600 mb-6 text-center">{{ message }}</p>
      <button @click="close" class="text-gray-400 hover:text-gray-600 px-4 py-2 rounded">
        {{ $t('labels.close') }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useNotificationStore } from '../../storage/notification.store';

export default {
  setup() {
    const notificationStore = useNotificationStore();
    const visible = ref(false);
    const message = ref('');

    function close() {
      visible.value = false;
      notificationStore.clearNewMessage();
    }

    return {
      visible,
      message,
      close,
      notificationStore
    };
  },
  mounted() {
    this.notificationStore.$subscribe((mutation, state) => {
        console.log('Notification received:', state.state);
        if(state.isNewMessage) {
          this.visible = true;
          this.message = state.message
          this.title = state.title
        }
    });
  }
};
</script>