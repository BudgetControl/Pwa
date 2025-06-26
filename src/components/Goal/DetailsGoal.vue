<template>
    <div class="relative pt-1">
        
        <!-- Card principale -->
        <div class="bg-emerald-500 m-4 p-6 rounded-lg text-white">
            <div class="flex flex-col items-center">
                <i class="fas fa-piggy-bank text-4xl mb-4"></i>
                <h2 class="text-2xl font-bold mb-2">{{ $t('labels.my_goal') }}</h2>
                <div class="text-4xl font-bold mb-4">{{currency}} {{ goal.target_amount }}</div>
                <div class="text-sm mb-4">{{goal.due_date}}</div>
                
                <!-- Progress bar -->
                <div class="w-full bg-emerald-400 rounded-full h-2 mb-4">
                    <div class="bg-white h-2 rounded-full" :style="goal.percentage"></div>
                </div>
                
                <div class="flex justify-between w-full text-sm">
                    <span>{{ $t('labels.saved') }}: {{currency}} {{goal.balance}}</span>
                    <span>64%</span>
                </div>

                <!-- Add Money Button -->
                <button class="bg-white text-emerald-600 px-6 py-2 rounded-full mt-4 font-semibold">
                    {{ $t('labels.add') }}
                </button>
            </div>
        </div>

        <!-- Dettagli -->
        <div class="px-4">
            <div class="grid grid-cols-2 gap-4 mb-4">
                <div class="text-gray-600">{{ $t('labels.goal_name') }}</div>
                <div class="text-right font-semibold">{{ goal.name }}</div>
                
                <div class="text-gray-600">{{ $t('labels.target_amount') }}</div>
                <div class="text-right font-semibold">{{ currency }} {{ goal.target_amount }}</div>
                
                <div class="text-gray-600">{{ $t('labels.current_saved') }}</div>
                <div class="text-right font-semibold">{{currency}} {{ goal.balance }}</div>
                
                <div class="text-gray-600">{{ $t('labels.monthy_deposit') }}</div>
                <div class="text-right font-semibold">{{currency}} {{ goal.monthly_deposit }}</div>
                
                <div class="text-gray-600">{{ $t('labels.due_date') }}</div>
                <div class="text-right font-semibold">{{ goal.due_date }}</div>
            </div>

            <!-- Buttons -->
            <div class="flex gap-4 mb-6">
                <router-link :to="`/app/goals/edit/${goalId}`" class="flex-1 p-3 bg-emerald-600 text-white py-2 rounded-lg">
                    <i class="fas fa-edit mr-2"></i> {{ $t('labels.edit') }}
                </router-link>
                <router-link to="/app/dashboard" class="flex-1 p-3 border border-red-500 text-red-500 py-2 rounded-lg">
                    <i class="fas fa-trash mr-2"></i> {{ $t('labels.delete') }}
                </router-link>
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
    </div>
</template>

<script>
import GoalService from '../../services/goal.service';
import { useAppSettings } from '../../storage/settings.store';
import EntriesTable from '../Entry/EntriesTable.vue';

export default {
    name: 'DetailsGoal',
    components: {
        EntriesTable
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
                percentage: 'width: 0%;'
            }
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
                        percentage: `width: ${goal.percentage}%`
                    };

                    this.$refs.entry.buildEntriesTable(entries);

                } else {
                    this.$router.push({ name: 'goals' });
                }
            }).catch(error => {
                console.error('Error fetching goal:', error);
                this.$router.push({ name: 'goals' });
            });
        }
    }

}
</script>