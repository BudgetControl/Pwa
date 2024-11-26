<template>
    <section class="relative py-16 bg-slate-200">
        <div class="container mx-auto px-4">
            <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg ">
                <div
                    class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
                    <HeaderButton back="/app/settings" title="Model settings" />

                    <div class="container px-4 mx-auto"
                        v-on:click="this.$router.push({ path: `/app/settings/model/add` })">

                        <button
                            class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button">
                            {{ $t('labels.add_new_model') }}
                        </button>

                    </div>

                    <!-- labels -->
                    <EntriesTable ref="entry" :isModel="true" />

                </div>
            </div>
        </div>
    </section>
</template>
<script>

import HeaderButton from '@/components/Button/HeaderButton.vue';
import CoreService from '../../services/core.service';
import '@vuepic/vue-datepicker/dist/main.css'
import EntriesTable from '../../components/Entry/EntriesTable.vue';

export default {
    components: {
        HeaderButton, EntriesTable
    },
    setup() {
        const apiService = new CoreService()

        return {
            apiService
        }
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
        this.apiService.model().then((res) => {
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