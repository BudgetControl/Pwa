<template>
  <div>
    <a class="text-blueGray-500 py-1 px-3" href="#pablo" ref="btnDropdownRef" v-on:click="toggleDropdown($event)">
      <i :class="'fas ' + icon"></i>
    </a>
    <div ref="popoverDropdownRef"
      class="bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48" v-bind:class="{
        hidden: !dropdownPopoverShow,
        block: dropdownPopoverShow,
      }">

      <router-link :to="`/app/${type}/${entryId}?${queryParams}`" v-slot="{ href, navigate, isActive }">
        <a :href="href" @click="navigate"
          class="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700 uppercase text-xs" :class="[
            isActive
              ? 'text-emerald-500 hover:text-emerald-600'
              : 'text-blueGray-700 hover:text-blueGray-500',
          ]">
          <i class="text-xs fa-solid fa-arrow-right-from-bracket"></i> {{ $t('labels.edit') }}
        </a>
      </router-link>

      <a href="javascript:void(0)" v-on:click="deleteEntry()"
        class="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700 uppercase text-xs">
        <i @click=archive(entry.uuid) class="text-xs fa-solid fa-trash text-red-500"></i> {{ $t('labels.delete') }} 
      </a>
    </div>
  </div>
</template>
<script>
import { createPopper } from "@popperjs/core";
import ApiService from "../../services/ApiService.vue";

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
      default: "entry"
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
      if (this.$refs.popoverDropdownRef && !this.$refs.popoverDropdownRef.contains(event.target) && !this.$refs.btnDropdownRef.contains(event.target)) {
      this.dropdownPopoverShow = false;
      document.removeEventListener('click', this.handleClickOutside);
      }
    },
    deleteEntry() {
      this.dropdownPopoverShow = false;
      let isPlanned = this.queryParams == 'planned=true'

      switch (this.type) {
      case 'planned_entry':
      case 'entry':
        ApiService.deleteEntry(this.entryId, isPlanned).then(() => {
        this.$emit('deleteItem', this.index)
        }).catch((error) => {
        console.error(error);
        })
        break;
      case 'model':
        ApiService.deleteModel(this.entryId).then(() => {
        this.$emit('deleteItem', this.index)
        }).catch((error) => {
        console.error(error);
        })
        break;
      }
    }
  }
};
</script>
