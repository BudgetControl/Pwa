<template>
    <div class="relative pt-1">
        <router-link :to="'/app/goals/edit/' + uuid" class="flex flex-wrap w-full">
            <!-- Colonna sinistra (stretta) -->
            <div class="md:w-2/12">
                <i class="fa-solid fa-plane text-xl"></i>
            </div>
            <!-- Colonna centrale (larga) -->
            <div class="md:w-8/12">
                <div class="px-4 ">
                    <p class="text-xs font-semibold uppercase ">
                        Holiday trip
                    </p>
                    <p class="text-xs font-semibold uppercase bolder py-2">
                        <span> 900.00 </span> / <span class="text-emerald-600">1400.00</span> €
                    </p>
                    <div class="overflow-hidden h-2 text-xs flex rounded bg-emerald-200 ">
                        <div style="width: 60%"
                            class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-600 ">
                        </div>
                    </div>
                </div>
            </div>
            <!-- Colonna destra (stretta) -->
            <div class="md:w-2/12 text-right">
                <EntryActionDropdown>
                    <Action :onAction="() => goToRoute(entry.uuid)" :label="$t('labels.details')"
                        iconClass="fa-solid fa-eye" />
                    <Action :onAction="() => archive(entry.uuid, i)" :label="$t('labels.archive')"
                        iconClass="fa-solid fa-trash-can-arrow-up text-red-400" />
                </EntryActionDropdown>
            </div>
        </router-link>
    </div>
</template>

<script>
import EntryActionDropdown from "@/components/Dropdowns/EntryActionDropdown.vue";
import Action from "@/components/Dropdowns/Action.vue";
import ConfirmModal from '@/components/GenericComponents/ConfirmModal.vue';

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
}
</script>