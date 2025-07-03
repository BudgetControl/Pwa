<template>
    <div class="relative pt-1">

        <HeaderMenu>
            <MenuButton :path="'/app/goals/new?tab=2'" :label="$t('labels.add')"
                v-on:click="toggleTabs(2); $router.go(0)" />
            <MenuButton :path="'/app/goals'" :label="$t('labels.show')" />
        </HeaderMenu>

        <!-- Card principale -->
        <div class="bg-emerald-500 m-4 p-6 rounded-lg text-white">
            <div class="flex flex-col items-center">
                <i class="fas fa-piggy-bank text-4xl mb-4"></i>
                <h2 class="text-2xl font-bold mb-2">{{ $t('labels.my_goal') }}</h2>
                <div class="text-4xl font-bold mb-4">{{ currency }} {{ goal.target_amount }}</div>
                <div class="text-sm mb-4">{{ goal.due_date }}</div>

                <!-- Progress bar -->
                <div class="w-full bg-emerald-400 rounded-full h-2 mb-4">
                    <div class="bg-white h-2 rounded-full" :style="'wodth: ' + goal.percentage + '%'"></div>
                </div>

                <div class="flex justify-between w-full text-sm">
                    <span>{{ $t('labels.saved') }}: {{ currency }} {{ goal.balance }}</span>
                    <span>{{ goal.percentage }}%</span>
                </div>

                <!-- Add Money Button -->
                <div class="flex gap-3 mt-4 justify-center">
                    <router-link :to="'/app/entry/goal/' + goal.uuid"
                        class="bg-white text-emerald-600 px-4 py-2 rounded-full font-semibold text-center">
                        {{ $t('labels.add') }}
                    </router-link>

                    <router-link :to="'/app/entry/goal/' + goal.uuid + '?goal_type=withdrawal'"
                        class="bg-white text-emerald-600 px-4 py-2 rounded-full font-semibold text-center">
                        {{ $t('labels.withdrawal') }}
                    </router-link>
                </div>
            </div>
        </div>

        <!-- Dettagli -->
        <div class="px-4 bg-white rounded-lg shadow-lg m-4 p-6">
            <div class="grid grid-cols-2 gap-4 mb-4">
                <div class="text-gray-600">{{ $t('labels.goal_name') }}</div>
                <div class="text-right font-semibold">{{ goal.name }}</div>

                <div class="text-gray-600">{{ $t('labels.description') }}</div>
                <div class="text-right font-semibold text-sm">{{ goal.description }}</div>

                <div class="text-gray-600">{{ $t('labels.target_amount') }}</div>
                <div class="text-right font-semibold">{{ currency }} {{ goal.target_amount }}</div>

                <div class="text-gray-600">{{ $t('labels.current_saved') }}</div>
                <div class="text-right font-semibold">{{ currency }} {{ goal.balance }}</div>

                <div class="text-gray-600">{{ $t('labels.monthly_deposit') }}</div>
                <div class="text-right font-semibold">{{ currency }} {{ goal.monthly_deposit }}</div>

                <div class="text-gray-600">{{ $t('labels.due_date') }}</div>
                <div class="text-right font-semibold">{{ goal.due_date }}</div>
            </div>

            <!-- Buttons -->
            <div class="flex gap-4 mb-6">
                <router-link :to="`/app/goals/edit/${goalId}`"
                    class="flex-1 p-3 bg-emerald-600 text-white py-2 rounded-lg">
                    <i class="fas fa-edit mr-2"></i> {{ $t('labels.edit') }}
                </router-link>
                <button v-on:click="deleteGoal" class="flex-1 p-3 border border-red-500 text-red-500 py-2 rounded-lg">
                    <i class="fas fa-trash mr-2"></i> {{ $t('labels.delete') }}
                </button>
            </div>

            <!-- Activity Section -->
            <div class="mb-6">
                <h3 class="text-lg font-semibold mb-4">{{ $t('labels.activity') }}</h3>
                <div class="space-y-4">

                    <EntriesTable ref="entry" />


                    <!-- <div class="flex items-center justify-between py-2 border-b">
                        <div>
                            <div class="flex items-center">
                                <i class="fas fa-arrow-up text-emerald-500 mr-3"></i>
                                <div>
                                    <div class="font-semibold">{{ $t('labels.deposit') }}</div>
                                    <div class="text-sm text-gray-500">May 10, 2024</div>
                                </div>
                            </div>
                        </div>
                        <div class="text-emerald-500 font-semibold">+$320</div>
                    </div> -->

                </div>
            </div>
        </div>
        <ConfirmModal ref="confirmModal" />
        <AlertModal ref="alertModal" />
    </div>
</template>

<script>
import GoalService from '../../services/goal.service';
import { useAppSettings } from '../../storage/settings.store';
import EntriesTable from '../Entry/EntriesTable.vue';
import MenuButton from '../GenericComponents/MenuButton.vue';
import HeaderMenu from '../Navbars/HeaderMenu.vue';
import ConfirmModal from '../GenericComponents/ConfirmModal.vue';
import AlertModal from '../GenericComponents/AlertModal.vue';

export default {
    name: 'DetailsGoal',
    components: {
        EntriesTable, HeaderMenu, MenuButton, ConfirmModal, AlertModal
    },
    data() {
        return {
            goalId: this.$route.params.id,
            currency: "€",
            goal: {
                icon: '',
                name: '',
                target_amount: 0,
                due_date: '',
                description: '',
                balance: 0,
                uuid: '',
                monthly_deposit: 0,
                percentage: 0
            }
        };
    },
    created() {
        window.confirm = (message) => {
            return this.$refs.confirmModal.show(message);
        };

        window.alert = (message, type = 'success') => {
            this.$refs.alertModal.show(message, type);
        };
    },
    setup() {
        const appSettings = useAppSettings();
        const goalService = new GoalService();
        const settings = {
            currency: appSettings.get()
        };

        return {
            settings,
            goalService
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.currency_id = this.settings.currency.icon;
            this.goalService.get(this.goalId).then(goal => {
                if (goal) {
                    const entries = goal.entries || [];
                    this.goal = {
                        icon: goal.category_icon,
                        name: goal.name,
                        target_amount: goal.target_amount,
                        due_date: goal.due_date,
                        description: goal.description,
                        balance: goal.balance,
                        uuid: goal.uuid,
                        monthly_deposit: goal.monthly_deposit,
                        percentage: goal.percentage
                    };

                    this.$refs.entry.buildEntriesTable(entries);

                } else {
                    this.$router.push({ name: 'goals' });
                }
            }).catch(error => {
                console.error('Error fetching goal:', error);
                this.$router.push({ name: 'goals' });
            });
        },
        deleteGoal() {
            const userConfirmed = window.confirm(this.$t('messages.confirm_delete_goal'));
            if ( userConfirmed) {
                this.goalService.delete(this.goalId).then(() => {
                    alert(this.$t('messages.goal.deleted', 'success'));
                    this.$router.push({ name: 'goals' });
                }).catch(error => {
                    console.error('Error deleting goal:', error);
                    alert(this.$t('messages.error_deleting_goal', 'error'));
                });
            }
        },
    }

}
</script>