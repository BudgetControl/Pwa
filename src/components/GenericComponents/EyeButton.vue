<template>
    <button v-on:click="toggleHide($event)">
        <i v-if="hideIcon === false" class="fas fa-eye"></i>
        <i v-if="hideIcon === true" class="fas fa-eye-slash"></i>
    </button>
</template>


<script>
import { useAppSettings } from '../../storage/settings.store';

export default {
  setup() {
    const eyeStore = useAppSettings();
    eyeStore.state = eyeStore.getEye();
    return {
      eyeStore
    };
  },
  data() {
    return {
      hideIcon: false
    };
  },
  mounted() {
    this.hideIcon = this.eyeStore.settings.eye_settings;
    this.updateBodyClass();
  },
  methods: {
    toggleHide(event) {
      event.preventDefault();
      this.eyeStore.settings.eye_settings = !this.hideIcon
      this.updateBodyClass();
      this.eyeStore.setEye(this.eyeStore.settings.eye_settings);
    },
    updateBodyClass() {
      if (this.eyeStore.settings.eye_settings) {
        document.body.classList.add('hide-content');
        this.hideIcon = true;
      } else {
        document.body.classList.remove('hide-content');
        this.hideIcon = false;
      }
    }
  }
};
</script>