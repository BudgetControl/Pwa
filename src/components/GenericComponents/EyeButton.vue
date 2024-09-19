<template>
    <button v-on:click="toggleHide($event)">
        <i v-if="hideIcon === false" class="fas fa-eye"></i>
        <i v-if="hideIcon === true" class="fas fa-eye-slash"></i>
    </button>
</template>


<script>
import { useEye } from '../../storage/settings.store';

export default {
  setup() {
    const eyeStore = useEye();
    eyeStore.state = eyeStore.get();
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
    this.hideIcon = this.eyeStore.state;
    this.updateBodyClass();
  },
  methods: {
    toggleHide(event) {
      event.preventDefault();
      this.eyeStore.state = !this.hideIcon
      this.updateBodyClass();
      this.eyeStore.set(this.eyeStore.state);
    },
    updateBodyClass() {
      if (this.eyeStore.state) {
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