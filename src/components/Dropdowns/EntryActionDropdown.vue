<template>
  <div>
    <a class="text-blueGray-500 py-1 px-3" href="#pablo" ref="btnDropdownRef" v-on:click="toggleDropdown($event)">
      <i class="fas fa-ellipsis-v"></i>
    </a>
    <div ref="popoverDropdownRef"
      class="bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-28" v-bind:class="{
        hidden: !dropdownPopoverShow,
        block: dropdownPopoverShow,
      }">

        <slot></slot>
      
    </div>
  </div>
</template>
<script>
import { createPopper } from "@popperjs/core";

export default {
  data() {
    return {
      dropdownPopoverShow: false,
      isPlanned: 0
    };
  },
  methods: {
    toggleDropdown: function (event) {
      event.preventDefault();
      if (this.dropdownPopoverShow) {
      this.dropdownPopoverShow = false;
      } else {
      this.dropdownPopoverShow = true;
      createPopper(this.$refs.btnDropdownRef, this.$refs.popoverDropdownRef, {
        placement: "right",
      });
      document.addEventListener('click', this.handleClickOutside);
      }
    },
    handleClickOutside(event) {
      if (this.$refs.popoverDropdownRef && !this.$refs.popoverDropdownRef.contains(event.target) && !this.$refs.btnDropdownRef.contains(event.target)) {
      this.dropdownPopoverShow = false;
      document.removeEventListener('click', this.handleClickOutside);
      }
    }
  }
};
</script>
