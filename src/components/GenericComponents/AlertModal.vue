<template>
    <transition name="slide-down">
      <div v-if="visible" :class="['alert', alertClass]" class="text-white px-6 py-4 border-0 relative mb-4">
        <span class="text-xl inline-block mr-5 align-middle">
          <i class="fas fa-bell"></i>
        </span>
        <span class="inline-block align-middle mr-8">
          {{ message }}
        </span>
        <button class="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none" v-on:click="close()">
          <span>×</span>
        </button>
      </div>
    </transition>
  </template>
<script>
export default {
  data() {
    return {
      visible: false,
      message: '',
      type: 'success',  // Default type
      timeoutId: null
    };
  },
  computed: {
    alertClass() {
      return this.type === 'error' ? 'bg-red-500' : 'bg-sky-500';
    }
  },
  methods: {
    show(message, type = 'success') {
      this.message = message;
      this.type = type;
      this.visible = true;
      this.clearTimeout();

      // Nascondi l'alert dopo 2 secondi se l'utente non clicca chiudi
      this.timeoutId = setTimeout(() => {
        this.close();
      }, 2000);
    },
    close() {
      this.clearTimeout();
      this.visible = false;
    },
    clearTimeout() {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
    }
  }
};
</script>
<style scoped>
.alert {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  z-index: 9999;
  transition: transform 0.5s ease, opacity 0.5s ease;
}

/* Animazioni */
.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.5s ease;
}

.slide-down-enter {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

/* Classi per i tipi di alert */
.bg-emerald-500 {
  background-color: #10b981;
}

.bg-red-500 {
  background-color: #ef4444;
}
</style>
