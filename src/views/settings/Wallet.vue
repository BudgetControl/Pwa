<template>
    <section class="relative py-16 bg-blueGray-200">
        <div class="container mx-auto px-4">
            <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
                <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
                    <HeaderButton back="/app/settings" title="Wallet settings" />

                    <!-- wallets -->
                    <div class="container px-4 mx-auto" v-on:click="openModal(null)">
                        <div class="flex border border-dotted m-1 bg-blueGray-200">
                            <div class="flex lg:w-2/12 p-2">
                                <i class="fas fa-plus fa-lg"></i>
                            </div>
                            <div class="flex lg:w-10/12 p-2">
                                <p>
                                    Add new wallet
                                </p>
                            </div>
                        </div>
                    </div>

                    <draggable :list="wallets" group="wallet" @start="drag = true" @end="saveSorting"
                        :move="checkMove">
                        <template #item="{ element }">
                            <div class="container px-4 mx-auto ">
                                <div class="flex border border-dotted m-1">
                                    <div class="flex lg:w-2/12 p-2">
                                        <i class="fas fa-wallet fa-lg" :style="'color:' + element.color"></i>
                                    </div>
                                    <div class="flex lg:w-10/12 p-2">
                                        <p>{{ element.name }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </draggable>

                </div>
            </div>
        </div>
    </section>
</template>
<script>

import HeaderButton from '@/components/Button/HeaderButton.vue';
import ApiService from '@/services/ApiService.vue';
import '@vuepic/vue-datepicker/dist/main.css'
import draggable from 'vuedraggable'

export default {
    components: {
        HeaderButton, draggable
    },
    data() {
        return {
            sortingList: [],
            showModal: false,
            wallets: [],
            color: null,
        }
    },
    mounted: function () {
        this.getWallets()
    },
    methods: {
        getWallets() {
            ApiService.accounts().then((res) => {
                res.data.forEach(e => {
                    this.wallets.push(e)
                });
            })
        },
        saveSorting() {
            let i = 0;
            this.sortingList.forEach((e) => {
                i++;
                ApiService.setAccountSorting(e.id, i)
            })
        },
        checkMove: function (e) {
            this.sortingList = e.relatedContext.list;
        }
    }
};
</script>

<style>
.vacp-color-input-group {
    display: none !important;
}

.vacp-copy-button {
    display: none !important;
}
</style>
  