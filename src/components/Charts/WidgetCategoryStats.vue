<template>
    <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div class="rounded-t mb-0 px-4 py-3 border-0 cursor-pointer" @click="toggleVisibility">
            <div class="flex flex-wrap items-center">
                <div class="relative w-full px-4 max-w-full flex-grow flex-1">
                    <h3 class="font-semibold text-base text-slate-700">
                        <i class="fas fa-chevron-right mr-2" :class="{ 'transform rotate-90': isVisible }"></i>
                        {{ $t('labels.category_details') }}
                    </h3>
                </div>
            </div>
        </div>
        <div v-show="isVisible" class="flex flex-wrap w-full relative">
            <Loading :show="isLoading" />
            <div class="container px-1 text-sm" v-for="(value, i) in dataset" :key="i">
                <div class="flex flex-wrap mt-1 p-2 border rounded border-blueGray-300 bg-white">
                    <div class="flex-1">
                        <div class=" p-2 text-center inline-flex items-center justify-center w-8 h-8 shadow-lg rounded-full mr-2"
                            :style="'background-color: ' + value.color">
                            <i :class="value.icon + ' text-white'"> </i>
                        </div>
                        <span class="text-blueGray-700 p-2 inline-flex items-center justify-center">{{ value.name }} </span>
                    </div>
                    <div class="text-right p-2 inline-flex items-center justify-center">
                        <span class="text-blueGray-700">{{ value.amount }} {{ currency }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useAppSettings } from "../../storage/settings.store";
import { ref } from 'vue';
import Loading from '../GenericComponents/Loading.vue'

export default {
    components: { Loading },
    data() {
        return {
            isLoading: false,
            subTitle: null,
            currency: '€',
            dataset: [],
            isVisible: true
        };
    },

    setup() {
        const appSettings = useAppSettings();

        return {
            appSettings,
        };
    },

    methods: {
        toggleVisibility() {
            this.isVisible = !this.isVisible;
        },
        setGraph(data) {
            this.isLoading = true

            this.currency = this.appSettings.settings.currency.symbol
            this.dataset = []

            data.forEach(element => {

                const translatedLabel = this.$t("app." + element.label);
                const label = translatedLabel.startsWith("app.") ? element.label : translatedLabel;

                this.dataset.push({
                    name: label,
                    icon: element.icon,
                    amount: element.value.toFixed(2),
                    color: element.color,
                });

            });

            this.isLoading = false
        },
    },
};
</script>

<style scoped>
.transform {
    transition: transform 0.2s ease;
}
</style>