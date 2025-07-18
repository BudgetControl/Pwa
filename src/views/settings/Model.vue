<template>
    <div class="p-6 bg-gray-100 min-h-screen">
        <!-- Intestazione desktop -->
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-800">{{ $t('labels.model_settings') }}</h1>
                <p class="text-gray-600 mt-1">{{ $t('labels.manage_your_models') }}</p>
            </div>
        </div>

        <div class="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-3">
                <button
                    class="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
                    v-on:click="$router.push({ path: `/app/settings/model/add`, query: { showDetails: true } })">
                    <i class="fas fa-plus mr-2"></i> {{ $t('labels.add_new_model') }}
                </button>
            </div>

        <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div class="p-6">
                <!-- Tabella dei modelli -->
                <EntriesTable ref="entry" :isModel="true" />
            </div>
        </div>
    </div>
</template>

<script>

import CoreService from '../../services/core.service';
import '@vuepic/vue-datepicker/dist/main.css'
import EntriesTable from '../../components/Entry/EntriesTable.vue';

export default {
    components: {
        EntriesTable
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