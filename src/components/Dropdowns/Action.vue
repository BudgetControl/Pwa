<template>
    <div @click="action" class="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700 uppercase text-xs">
        <i :class="'text-xs ' + iconClass"></i> {{label}}
    </div>
</template>


<script>
export default {
    props: {
        iconClass: {
            type: String,
            default: 'fa-solid fa-circle',
        },
        label: {
            type: String,
            required: true,
        },
        onAction: {
            type: Function,
            required: true,
        },
    },
    methods: {
        action() {
            console.log('Action triggered');
            this.onAction();
        },
    },
};
</script>
