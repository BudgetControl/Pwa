<template>
    <section class="relative py-16 bg-blueGray-200">
        <div class="container mx-auto px-4">
            <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
                <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
                    <HeaderButton back="/app/settings" title="Category settings" />

                    <!-- labels -->
                    <div class="container px-4 mx-auto " v-for="(item, k) in labels" :key="k" v-on:click="openModal(item.id)">
                        <div class="flex border border-dotted m-1">
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
            modal: {
                id: null,
                name: null,
                color: null,
                deleted: false,
            }
        }
    },
    mounted: function () {
        ApiService.labels().then((res) => {
            res.data.forEach(e => {
                this.labels.push(e)
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
  