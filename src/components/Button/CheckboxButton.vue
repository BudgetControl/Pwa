<template>
    <div class="flex w-full mb-2">
        <label :for="'checkbox_id_'+id" :id="'checkbox_id_'+id"
            :class="{ 'bg-emerald-500 text-white': active, 'bg-blueGray-200': !active }"
            class="w-full text-center active:bg-emerald-500 uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear"
            @click="handleClick">
            {{ label }}
            <input :id="'checkbox_id_'+id" type="checkbox" v-model="active" value="true" class="hidden" />
        </label>
    </div>
</template>
<script>

export default {
    props: {
        label: {
            type: String,
            required: true,
        },
        status: {   
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            active: this.status,
            id: this.$options.name + '-' + Math.random().toString(36).substring(2, 15),
        }
    },
    methods: {
        handleClick() {
            this.active = !this.active;
            this.$emit('update:active', this.active);
        }
    }
}
</script>