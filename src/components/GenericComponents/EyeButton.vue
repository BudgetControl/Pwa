<template>
    <button v-on:click="toggleHide($event)">
        <i v-if="hide === false" class="fas fa-eye"></i>
        <i v-if="hide === true" class="fas fa-eye-slash"></i>
    </button>
</template>


<script>
export default {
  data() {
    return {
        hide: true,
    };
  },
  mounted() {
    document.body.classList.add('hide-content');
  },
  methods: {
    toggleHide: function (event) {
      event.preventDefault();
      if (this.hide) {
        this.hide = false;
        this.$nextTick(() => {
            document.body.classList.remove('hide-content');
        });
      } else {
        this.hide = true;
        this.$nextTick(() => {
            document.body.classList.toggle('hide-content');
        });
      }
    },
  },
};
</script>