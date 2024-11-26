<template>
    <div class="container">

        <div v-if="entries === false" class="row border p-5 border-dotted m-1">
            {{  $t('labels.no_voices_found') }}
        </div>
        <Budget v-if="budget" :budget="budget" :currency="currency" :key="budget.id" />
        <EntriesTable ref="entry" />
    </div>
</template>

<script>
import BudgetService from '../../services/budget.service';

import EntriesTable from '../Entry/EntriesTable.vue';
import Budget from '../../components/Budget/Budget.vue';

export default {
    components: {
        EntriesTable, Budget
    },
    props: {
        uuid: {
            type: String,
            default: null,
            required: true
        }
    },
    setup() {

        const apiService = new BudgetService()

        return {
            apiService
        }
    },
    data() {
        return {
            entries: null,
            budget: null,
            currency: '€'
        }
    },
    mounted() {
        this.getEntries()
        this.getBudget()
    },
    methods: {
        async getBudget() {
            const uuid = this.uuid
            this.apiService.getBudgetStats(uuid).then((res) => {
                this.budget = res
            })
        },
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