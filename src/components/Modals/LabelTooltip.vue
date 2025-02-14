<template>
    <div class="flex flex-wrap">
        <label class="block uppercase text-slate-600 text-xs font-bold mb-2" ref="btnRef">
            {{ title }}
            <i v-on:mouseenter="toggleTooltip()" v-on:mouseleave="toggleTooltip()" class="fa-solid fa-circle-info"></i>
        </label>
        <div ref="popoverRef" v-bind:class="{ 'hidden': !popoverShow, 'block': popoverShow }"
            class="bg-emerald-500 border-0 block font-normal leading-normal text-sm max-w-sm text-center mr-10 no-underline break-words rounded-lg ">
            <div class="text-white p-3">
                {{ content }}
            </div>
        </div>
    </div>
</template>

<script>

import { createPopper } from "@popperjs/core";

export default {
    name: "left-emerald-tooltip",
    props: {
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            popoverShow: false
        }
    },
    methods: {
        toggleTooltip: function () {
            if (this.popoverShow) {
                this.popoverShow = false;
            } else {
                this.popoverShow = true;
                createPopper(this.$refs.btnRef, this.$refs.popoverRef, {
                    placement: "left"
                });
            }
        }
    }
}
</script>