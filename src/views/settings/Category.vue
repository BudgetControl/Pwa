<template>
    <section class="relative py-16 bg-blueGray-200">
        <div class="container mx-auto px-4">
            <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
                <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
                    <HeaderButton back="/app/settings" title="Category settings" />

                    <div class="container px-4 mx-auto" v-on:click="openModal(null,null)">
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

                                        <span v-on:click="openModal(k,subItem.id)" v-if="subItem.custom == 1"
                                            class="text-xs align-right font-semibold  py-1 px-2 rounded text-blueGray-600 bg-blueGray-200 uppercase">
                                            edit
                                        </span>

                                        </p>
                                    </div>
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
            categories: [],
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
            res.forEach(e => {
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
            let path = '';
            if(id !== null) {
                path = `${id}/${subId}`
            }
            this.$router.push({path: `/app/settings/category/edit/${path}`})
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
  