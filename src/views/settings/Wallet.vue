<template>
    <section class="relative py-16 bg-slate-200">
        <div class="container mx-auto px-4">
            <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg ">
                <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
                    <HeaderButton back="/app/settings" title="Wallet settings" />

                    <!-- wallets -->
                    <div class="container px-4 mx-auto" v-on:click="openModal(null)">
                        <button
                                class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button">
                                {{ $t('labels.add_new_wallet') }}
                            </button>

                    </div>

                    <div class="container px-4 mx-auto">
                        <div class="flex border border-dotted m-1 bg-slate-200">
                            <ul
                                class="flex items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <!-- <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600 flex lg:w3/12 px-4">
                                    <div class="flex items-center ps-3">
                                        <input id="vue-checkbox-list" type="checkbox" v-model="action.order" value="true"
                                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                                        <label for="vue-checkbox-list"
                                            class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"> {{ $t('labels.change_order') }}</label>
                                    </div>
                                </li> -->
                                <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600 flex lg:w3/12 px-4">
                                    <div class="flex items-center ps-3">
                                        <input id="react-checkbox-list" type="checkbox" v-model="action.archived" value="true"
                                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                                        <label for="react-checkbox-list"
                                            class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{{ $t('labels.show_archived') }}</label>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <draggable :list="wallets" group="wallet" @end="saveSorting" :move="checkMove" :disabled="!action.order" >
                        <template #item="{ element }">
                            <div class="container px-4 mx-auto ">
                                <div class="flex border border-dotted m-1" v-on:click="openModal(element.uuid)"
                                v-if="action.archived == element.archived"
                                >
                                    <div class="flex p-2" v-if="action.order">
                                        <i class="fas fa-bars fa-lg"></i>
                                    </div>
                                    <div class="flex p-2">
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
import CoreService from '../../services/core.service';
import '@vuepic/vue-datepicker/dist/main.css'
import draggable from 'vuedraggable'

export default {
    components: {
        HeaderButton, draggable
    },
    setup() {
        const apiService = new CoreService()

        return {
            apiService
        }
    },
    data() {
        return {
            action: {
                order: false,
                archived: false
            },
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
        openModal(id) {
            if(id === null) {
                this.$router.push({ path: `/app/settings/wallet/add` })
            } else {
                this.$router.push({ path: `/app/settings/wallet/edit/${id}` })
            }
        },
        getWallets() {

            this.apiService.accounts("?filters[archived]=true&order[name]=asc").then((res) => {
                res.forEach(e => {
                    this.wallets.push(e)
                });
            })
        },
        saveSorting() {
            let i = 0;
            this.sortingList.forEach((e) => {
                i++;
                this.apiService.setAccountSorting(e.id, i)
            })
        },
        checkMove: function (e) {
            this.sortingList = e.relatedContext.list;
        }
    }
};
</script>

<style>.vacp-color-input-group {
    display: none !important;
}

.vacp-copy-button {
    display: none !important;
}</style>
  
