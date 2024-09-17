<template>
    <div class="container">
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
            entries: [],
            action: {
                reset: true
            }
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
                    this.$refs.entry.buildEntriesTable(res)
                }
            })
        }
    }
}
</script>