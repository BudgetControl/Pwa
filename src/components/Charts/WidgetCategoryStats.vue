<template>
    <div class="flex flex-wrap  w-full ">
        <div class="container px-1 text-sm" v-for="(value, i) in dataset" :key="i">
            <div class="flex flex-wrap mt-1 p-2 border rounded border-blueGray-300 bg-white">
                <div class="flex-1">
                    <div class=" p-2 text-center inline-flex items-center justify-center w-8 h-8 shadow-lg rounded-full mr-2"
                        :style="'background-color: ' + value.color">
                        <i :class="value.icon"> </i>
                    </div>
                    <span class="text-blueGray-700 p-2 inline-flex items-center justify-center">{{ value.name }} </span>
                </div>
                <div class="text-right p-2 inline-flex items-center justify-center">
                    <span class="text-blueGray-700">{{ value.amount }} {{ currency }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useAppSettings } from "../../storage/settings.store";

export default {
    data() {
        return {
            subTitle: null,
            currency: '€', // Utilizza una variabile locale per la valuta
            dataset: [], // Utilizza una variabile locale per il dataset
        };
    },

    setup() {
        const appSettings = useAppSettings();

        return {
            appSettings,
        };
    },

    methods: {
        setGraph(data) {

            this.currency = this.appSettings.settings.currency.symbol

            data.forEach(element => {

                this.dataset.push({
                    name: this.$t("app." + element.label),
                    icon: element.icon,
                    amount: element.value.toFixed(2),
                    color: element.color,
                });

            });

        },
    },
};
</script>