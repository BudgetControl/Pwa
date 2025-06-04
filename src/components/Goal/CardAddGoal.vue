<template>
    <div class="w-full lg:w-12/12 px-1">

        <HeaderMenu>
            <MenuButton :path="'/app/goals/new?tab=2'" :label="$t('labels.add')"
                v-on:click="toggleTabs(2); $router.go(0)" />
            <MenuButton :path="'/app/goals'" :label="$t('labels.show')" />
        </HeaderMenu>

        <div class="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">
            <div class="container x-4 mx-auto py-3">
                <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                    <div class="px-4 py-5 flex-auto">
                        <div class="tab-content tab-space">

                            <form>
                                <div
                                    class="container relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-slate-100 border-0 flex-auto p-4">
                                    <div class="flex flex-wrap py-3">
                                        <div class="w-full lg:w-12/12 px-4">
                                            <div
                                                class="container relative flex flex-col min-w-0 break-words w-full mb-6 rounded-lg border-0 flex-auto p-4">
                                                <div class="flex flex-wrap">
                                                    <GoalType v-model="data.type" :label="$t('labels.goal_type')" />
                                                    
                                                    <InputText v-model="data.name" :label="$t('labels.goal_name')" />

                                                    <Amount v-model="data.amount" :label="$t('labels.target_amount')" />

                                                </div>

                                                <div class="flex flex-wrap">
                                                    <Calendar v-model="data.target_date" :label="$t('labels.goal_target')" />
                                                </div>

                                                <div class="flex flex-wrap">
                                                    <TextNote v-model="data.note" :label="$t('labels.goal_note')" />
                                                </div>

                                                <div class="flex flex-wrap py-3">
                                                    <Buttons :id="id"
                                                        v-on:set="setGoal"
                                                        v-on:update="updateGoal"
                                                        v-on:delete="deleteGoal" />
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <AlertModal ref="alertModal" />
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>

</template>

<script>
import '@vuepic/vue-datepicker/dist/main.css'
import MenuButton from '../GenericComponents/MenuButton.vue';
import HeaderMenu from '../Navbars/HeaderMenu.vue';
import AlertModal from '../GenericComponents/AlertModal.vue';

import TextNote from '../Input/TextNote.vue';
import Amount from '../Input/Amount.vue';
import InputText from '../Input/Text.vue';
import Buttons from '../Input/Buttons.vue';
import Calendar from '../Input/Calendar.vue';
import GoalType from '../Input/GoalType.vue';

export default {
    components: {
        MenuButton, HeaderMenu, AlertModal, TextNote, Amount, InputText, Buttons, Calendar, GoalType
    },
    data() {
        return {
            data: {
                name: '',
                amount: 0,
                note: '',
                notification: false,
                target_date: [],
            },
            id: null,
        };
    },
}
</script>