<template>
    <div class="container">

        <div v-if="entries === false" class="row border p-5 border-dotted m-1">
            {{  $t('labels.no_voices_found') }}
        </div>
        <EntriesTable ref="entry" />
    </div>
</template>

<script>
import BudgetService from '../../services/BudgetService.vue';
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
            BudgetService.getEntryList(uuid).then((res) => {
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