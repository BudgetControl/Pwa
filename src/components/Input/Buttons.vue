<template>
    <div class="lg:w-12/12 px-2 w-full">
        <button v-on:click="set()" v-if="!id"
            class="w-full bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button">
            {{ $t('labels.save') }}
        </button>

        <button v-on:click="update()" v-if="id"
            class="w-full bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button">
            {{ $t('labels.update') }}
        </button>

        <button v-on:click="deleteAction()" v-if="id"
            class="w-full bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button">
            {{ $t('labels.delete') }}
        </button>
    </div>
</template>

<script>

export default {
    props: {
        id: {
            type: String,
            default: null,
        },
    },
    methods: {
        set() {
            this.$emit('set');
        },
        update() {
            this.$emit('update');
        },
        deleteAction() {
            this.$emit('delete');
        }
    }
};
</script>