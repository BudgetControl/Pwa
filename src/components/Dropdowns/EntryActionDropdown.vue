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
import CoreService from "../../services/core.service";
import { getHeaderTokens } from "../../utils/headers-token";

export default {
  props: {
    entryId: {
      type: String,
      required: true
    },
    queryParams: {
      type: String,
      default: ""
    },
    icon: {
      type: String,
      default: "fa-ellipsis-v",
    },
    index: {
      required: true
    },
    type: {
      required: false,
      type: String,
      default: "emtry"
    }
  },
  setup() {
        const headers = getHeaderTokens()
        const apiService = new CoreService()

        return {
            apiService
        }
    },
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
      if (this.$refs.popoverDropdownRef && !this.$refs.btnDropdownRef.contains(event.target)) {
        this.dropdownPopoverShow = false;
        document.removeEventListener('click', this.handleClickOutside);
      }
    }
  }
};
</script>
