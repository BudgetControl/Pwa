<template>
    <div class="relative pt-1">
        <router-link :to="'/app/goals/details/' + localGoal.uuid" class="block w-full">
            <div class="flex items-center w-full px-4 gap-4"> <!-- Aggiunto gap-4 -->
                <!-- Colonna sinistra (stretta) -->
                <div class="w-12 flex-shrink-0"> <!-- Modificato -->
                    <i :class="localGoal.category_icon + ' text-xl'"></i>
                </div>
                <!-- Colonna centrale (larga) -->
                <div class="flex-1"> <!-- Modificato -->
                    <p class="text-xs font-semibold uppercase">
                        {{localGoal.name }}
                    </p>
                    <p class="text-xs font-semibold uppercase bolder py-2">
                        <span>{{ localGoal.balance }}</span> / <span class="text-emerald-600">{{ localGoal.amount }}</span> €
                    </p>
                    <div class="overflow-hidden h-2 text-xs flex rounded bg-emerald-200">
                        <div :style="'width: ' + mathPercetage() + '%'"
                            class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-600">
                        </div>
                    </div>
                </div>
                <!-- Colonna destra (stretta) -->
                <div class="w-12 flex-shrink-0 flex justify-end"> <!-- Modificato -->
                    <EntryActionDropdown>
                        <Action :onAction="() => goToRoute(localGoal.uuid)" :label="$t('labels.details')"
                            iconClass="fa-solid fa-eye" />
                        <Action :onAction="() => archive(localGoal.uuid, i)" :label="$t('labels.archive')"
                            iconClass="fa-solid fa-trash-can-arrow-up text-red-400" />
                    </EntryActionDropdown>
                </div>
            </div>
        </router-link>
    </div>
</template>

<script>
import EntryActionDropdown from "@/components/Dropdowns/EntryActionDropdown.vue";
import Action from "@/components/Dropdowns/Action.vue";

export default {
    props: {
        localGoal: {
            type: Object,
            required: true
        },
    },
    components: {
        EntryActionDropdown, Action
    },
    data() {
        return {
            uuid: this.$route.params.id,
        }
    },
    methods: {
        mathPercetage() {
            const value = this.localGoal.balance;
            const total = this.localGoal.amount;

            return (value / total) * 100;
        },
        goToRoute(uuid) {
            this.$router.push({ name: 'goalDetails', params: { id: uuid } });
        },
        archive(uuid, i) {
            this.$emit('archive', uuid, i);
        }
    }
    
}
</script>