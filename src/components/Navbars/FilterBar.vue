<template>
    <VueDatePicker @update:model-value="handleDateChange" class="align-center" v-model="date_time" :range="{ maxRange: 364 }"
        :required=true :placeholder="$t('labels.date_interval')" format="yyyy-MM-dd" />
</template>

<script>
import { useGraphStore } from '../../storage/graph';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

export default {
    name: "filter-bar",
    components: {
        VueDatePicker
    },
    data() {
        return {
            date_time: []
        }
    },
    setup() {
        const graphStore = useGraphStore()

        return {
            graphStore
        }
    },
    mounted() {
        if (this.graphStore.start_date && this.graphStore.end_date) {
            this.date_time = [this.graphStore.start_date, this.graphStore.end_date]
        } else {
            const today = new Date();
            const startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().substr(0, 10);
            const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().substr(0, 10)

            this.date_time = [startDate, endDate]
        }
    },
    methods: {
        handleDateChange(dates) {
            this.graphStore.start_date = dates[0].toISOString().substr(0, 10)
            this.graphStore.end_date = dates[1].toISOString().substr(0, 10)
        },
    }
};
</script>
