<template>
    <section class="relative py-16 bg-blueGray-200">
        <div class="container mx-auto px-4">
            <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
                <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
                    <HeaderButton back="/app/settings" title="Label settings" />

                    <div class="container px-4 mx-auto">
                        <div class="flex border border-dotted m-1 bg-blueGray-200">
                            <ul
                                class="flex items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600 flex lg:w3/12 px-4">
                                    <div class="flex items-center ps-3">
                                        <input id="react-checkbox-list" type="checkbox" v-model="action.archived" value="true"
                                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                                        <label for="react-checkbox-list"
                                            class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Show archived</label>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!-- labels -->
                    <div class="container px-4 mx-auto " v-for="(item, k) in labels" :key="k" v-on:click="openModal(item.id)">
                        <div class="flex border border-dotted m-1" v-if="item.archive == 0 || action.archived == true">
                            <div class="flex lg:w-2/12 p-2" :style="'background-color: '+item.color">
                            </div>
                            <div class="flex lg:w-10/12 p-2">
                                <p>
                                    {{ item.name }}
                                </p>
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
            labels: [],
            color: null,
            opentab: null,
            action: {
                archived: false
            },
            modal: {
                id: null,
                name: null,
                color: null,
                deleted: false,
            }
        }
    },
    mounted: function () {
        ApiService.labels('?archive=1').then((res) => {
            res.forEach(e => {
                this.labels.push(e)
            });
        })
    },
    methods: {

        openModal(id) {
            this.$router.push({path: `/app/settings/label/edit/${id}`})
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
  