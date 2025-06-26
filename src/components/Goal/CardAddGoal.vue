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
                                                    <GoalType v-model="data.category_icon"
                                                        :label="$t('labels.goal_type')" />

                                                    <InputText v-model="data.name" :label="$t('labels.goal_name')" />

                                                    <Amount v-model="data.amount" :label="$t('labels.target_amount')" />

                                                </div>

                                                <div class="flex flex-wrap">
                                                    <Calendar v-model="data.due_date"
                                                        :label="$t('labels.goal_target')" />
                                                </div>

                                                <div class="flex flex-wrap">
                                                    <TextNote v-model="data.description"
                                                        :label="$t('labels.goal_note')" />
                                                </div>

                                                <div class="flex flex-wrap py-3">
                                                    <Buttons :id="id" v-on:set="setGoal" v-on:update="updateGoal"
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

        <AlertModal ref="alertModal" />

    </div>

</template>

<script>
import '@vuepic/vue-datepicker/dist/main.css'
import MenuButton from '../GenericComponents/MenuButton.vue';
import HeaderMenu from '../Navbars/HeaderMenu.vue';
import AlertModal from '../GenericComponents/AlertModal.vue';
import GoalService from '../../services/goal.service';

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
                category_icon: '',
                name: '',
                amount: 0,
                due_date: null,
                description: '',
            },
            id: null,
        };
    },
    setup() {
        const goalService = new GoalService();
        return {
            goalService
        };

    },
    created() {
        window.alert = (message, type = 'success') => {
            this.$refs.alertModal.show(message, type);
        };
    },
    mounted() {
        const query = this.$route.query;
        const params = this.$route.params;
        if (query.tab) {
            this.toggleTabs(query.tab);
        }

        if (params.id) {
            this.id = params.id;
            this.goalService.get(this.id).then(goal => {
                if (goal) {
                    this.data = {
                        icon: goal.category_icon,
                        name: goal.name,
                        amount: goal.amount,
                        due_date: goal.due_date,
                        description: goal.description,
                    };
                } else {
                    this.$router.push('/app/goals');
                }
            });
        }
    },
    methods: {
        toggleTabs(tab) {
            this.$router.push({ path: '/app/goals/new', query: { tab: tab } });
        },
        setGoal() {
            if (!this.validation()) {
                return;
            }
            this.goalService.create(this.data).then(() => {
                alert(this.$t('messages.goal.created', 'success'));
                this.$router.push('/app/goals');
            }).catch(error => {
                console.error('Error creating goal:', error);
                alert(this.$t('messages.goal.error_creating'),'error');
            });
        },
        updateGoal() {
            this.goalService.update(this.id, this.data);
            this.$router.push('/app/goals');
        },
        deleteGoal() {
            this.goalService.delete(this.id).then(() => {
                alert(this.$t('messages.goal.deleted', 'success'));
                this.$router.push('/app/goals');
            }).catch(error => {
                console.error('Error deleting goal:', error);
                alert(this.$t('messages.goal.error_deleting'),'error');
            });
        },
        validation() {
            if (!this.data.due_date) {
                alert(this.$t('messages.date_required'),'error');
            }
            // if data is in past is not correct
            const today = new Date();
            if (new Date(this.data.due_date) < today) {
                alert(this.$t('messages.date_in_past'),'error');
                return false;
            }

            //if amount is not a number or less than 0
            if (isNaN(this.data.amount) || this.data.amount <= 0) {
                alert(this.$t('messages.amount_required'),'error');
                return false;
            }

            //if icon is not selected
            if (!this.data.category_icon) {
                alert(this.$t('messages.icon_required'),'error');
                return false;
            }

            //if name is empty
            if (!this.data.name.trim()) {
                alert(this.$t('messages.name_required'),'error');
                return false;
            }

            return true;
        },
    },
}
</script>