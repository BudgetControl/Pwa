<template>
    <div>
        <div v-if="showModal"
            class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
            <div class="relative w-auto my-6 mx-auto max-w-sm">
                <!--content-->
                <div
                    class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    <!--body-->
                    <div class="relative p-6 flex-auto">
                        <p class="my-4 text-blueGray-500 text-lg leading-relaxed">
                            {{ message }}
                        </p>
                    </div>
                    <!--footer-->
                    <div class="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                        <button
                            class="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button" v-on:click="confirm(false)">
                            {{ $t('labels.no') }}
                        </button>
                        <button
                            class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button" v-on:click="confirm(true)">
                            {{ $t('labels.yes') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="showModal" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            showModal: false,
            message: '',
        };
    },
    methods: {
        show: function (message) {
            this.message = message;
            this.showModal = !this.showModal;
            return new Promise((resolve) => { 
                this.resolve = resolve; 
            });
        },
        confirm(choice) { 
            this.resolve(choice); 
            this.showModal = !this.showModal; 
        },
    }
};
</script>