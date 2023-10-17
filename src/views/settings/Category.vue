<template>
    <section class="relative py-16 bg-blueGray-200">
        <div class="container mx-auto px-4">
            <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
                <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
                    <HeaderButton back="/app/settings" title="Category settings" />

                    <div class="container px-4 mx-auto" v-on:click="openModal(null)">
                        <div class="flex border border-dotted m-1 bg-blueGray-200">
                            <div class="flex lg:w-2/12 p-2">
                                <i class="fas fa-plus fa-lg"></i>
                            </div>
                            <div class="flex lg:w-10/12 p-2">
                                <p>
                                    Add new category
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- categories -->
                    <div class="container px-4 mx-auto " v-for="(item, k) in categories" :key="k" v-on:click="showSub(k)">
                        <div class="flex border border-dotted m-1">
                            <div class="flex lg:w-2/12 p-2">
                                <i :class="'fa-lg ' + item.icon + ' ' + item.type"></i>
                            </div>
                            <div class="flex lg:w-10/12 p-2">
                                <p>
                                    {{ item.name }}
                                </p>
                            </div>
                        </div>


                        <div v-if="opentab == k">
                            <div class="container px-4 mx-auto " v-for="(subItem, kk) in item.sub_category" :key="kk">
                                <div class="flex border border-dotted m-1">
                                    <div class="flex lg:w-2/12 p-2">
                                    </div>
                                    <div class="flex lg:w-10/12 p-2">
                                        <p class="w-full">
                                            {{ subItem.name }}

                                        <span v-on:click="openModal(k,kk)" v-if="subItem.custom == 1"
                                            class="text-xs align-right font-semibold  py-1 px-2 rounded text-blueGray-600 bg-blueGray-200 uppercase">
                                            edit
                                        </span>

                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                    <!-- modal -->
                    <div v-if="showModal"
                        class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex m-5">
                        <div class="relative w-auto my-6 mx-auto max-w-sm">
                            <!--content-->
                            <div
                                class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">

                                <!--body-->
                                <div class="relative p-6 flex-auto">
                                    <!-- Regular Input -->
                                    <div class="mb-3 pt-0">
                                        <input type="text" placeholder="Category name" v-model="modal.name"
                                            class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:shadow-outline w-full" />
                                    </div>

                                    <div class="mb-3 pt-0">
                                        <select
                                            class="w-full border-0 px-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                            v-model="modal.parent_category">
                                            <option value="0">Choose a parent category</option>
                                            <option v-for="(item, k) in categories" :key="k" :value="item.id">{{
                                                item.name }}</option>
                                        </select>
                                    </div>

                                    <div class="mb-3 pt-0">
                                        <label for="exclude_stats">
                                            <input v-model="modal.exclude_stats" type="checkbox" class="p-1 border rounded"
                                                id="exclude_stats" :value="true" checked> Exclude from stats
                                        </label>
                                    </div>

                                </div>
                                <!--footer-->
                                <div
                                    class="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                    <button
                                        class="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button" v-on:click="closeModal()">
                                        Close
                                    </button>
                                    <button
                                        class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button" v-on:click="saveModal()">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </section>
</template>
<script>

import HeaderButton from '@/components/Button/HeaderButton.vue';
import ApiService from '@/services/ApiService.vue';
import '@vuepic/vue-datepicker/dist/main.css'

export default {
    components: {
        HeaderButton
    },
    data() {
        return {
            showModal: false,
            categories: [],
            color: null,
            opentab: null,
            form: {
                type: ['incoming', 'expenses', 'investments'],
            },
            modal: {
                id: null,
                name: null,
                parent_category: [0],
                exclude_stats: false,
            }
        }
    },
    mounted: function () {
        ApiService.categories().then((res) => {
            res.data.forEach(e => {
                this.categories.push(e)
            });
        })
    },
    methods: {
        showSub(id) {
            if (this.opentab == id) {
                this.opentab = null
            } else {
                this.opentab = id
            }

        },
        openModal(id,subId) {
            if (id !== null) {
                let categories = this.categories
                this.modal.id = categories[id].sub_category[subId].id
                this.modal.name = categories[id].sub_category[subId].name
                this.modal.parent_category = categories[id].sub_category[subId].category_id
                this.modal.exclude_stats = (categories[id].sub_category[subId].exclude_from_stats == 1) ? true : false
            }

            this.showModal = true
        },
        closeModal() {
            this.showModal = false
            this.modal.id = null
            this.modal.name = null
            this.modal.exclude_stats = false
            this.modal.parent_category = null
        },
        saveModal() {
            ApiService.setCategories(this.modal, this.modal.id).then(() => {
                this.showModal = false
            })
        },
        updateColor(eventData) {
            this.modal.color = eventData.cssColor
        },
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

.expenses {
    color: red
}

.incoming {
    color: green
}
</style>
  