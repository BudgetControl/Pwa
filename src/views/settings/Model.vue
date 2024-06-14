<template>
    <section class="relative py-16 bg-blueGray-200">
        <div class="container mx-auto px-4">
            <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg ">
                <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
                    <HeaderButton back="/app/settings" title="Model settings" />

                    <div class="container px-4 mx-auto" v-on:click="this.$router.push({ path: `/app/settings/model/add` })">
                        <div class="flex border border-dotted m-1 bg-blueGray-200">
                            <div class="flex lg:w-2/12 p-2">
                                <i class="fas fa-plus fa-lg"></i>
                            </div>
                            <div class="flex lg:w-10/12 p-2">
                                <p>
                                    {{ $t('labels.add_new_model') }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- labels -->
                    <EntriesTable ref="entry" :isModel="true"/>

                </div>
            </div>
        </div>
    </section>
</template>
<script>

import HeaderButton from '@/components/Button/HeaderButton.vue';
import ApiService from '@/services/ApiService.vue';
import '@vuepic/vue-datepicker/dist/main.css'
import EntriesTable from '../../components/GenericComponents/EntriesTable.vue';

export default {
    components: {
        HeaderButton, EntriesTable
    },
    data() {
        return {
            models: [],
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
        const refs = this.$refs
        ApiService.model().then((res) => {
            refs.entry.buildEntriesTable(res)
        })
    },
    methods: {
        openModal(id) {
            this.$router.push({ path: `/app/settings/model/edit/${id}` })
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
  