<template>
    <div class="container">

        <div v-if="entries === false" class="row border p-5 border-dotted m-1">
            {{  $t('labels.no_voices_found') }}
        </div>
        <EntriesTable ref="entry" />
    </div>
</template>

<script>
import BudgetService from '../../services/budget.service';
import { getHeaderTokens } from '../../utils/headers-token';
import EntriesTable from '../Entry/EntriesTable.vue';

export default {
    components: {
        EntriesTable
    },
    props: {
        uuid: {
            type: String,
            default: null,
            required: true
        }
    },
    setup() {
        const headers = getHeaderTokens()
        const apiService = new BudgetService(headers)

        return {
            apiService
        }
    },
    data() {
        return {
            entries: null
        }
    },
    mounted() {
        this.getEntries()
    },
    methods: {
        async getEntries() {
            const uuid = this.uuid
            this.apiService.getEntryList(uuid).then((res) => {
                if (res.length > 0) {
                    this.entries = true
                    this.$refs.entry.buildEntriesTable(res)
                } else {
                    this.entries = false
                }
            })
        }
    }
}
</script>