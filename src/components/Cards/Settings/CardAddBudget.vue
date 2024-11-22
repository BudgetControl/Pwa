<template>
    <div class="w-full lg:w-12/12 px-1">

        <HeaderMenu>
            <MenuButton :path="'/app/budgets/new'" :label="$t('labels.add')" />

            <MenuButton :path="'/app/budgets'" :label="$t('labels.show')" />
        </HeaderMenu>

        <div class="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">
            <div class="container x-4 mx-auto py-3">
                <ul class="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row">
                    <li class="-mb-px mr-2 last:mr-0 flex-auto text-center">
                        <a class="text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal"
                            v-on:click="toggleTabs(1)"
                            v-bind:class="{ 'text-white bg-emerald-600': openTab !== 1, 'text-emerald-600 bg-white': openTab === 1 }">
                            {{$t('labels.list_of_voices')}}
                        </a>
                    </li>
                    <li class="-mb-px mr-2 last:mr-0 flex-auto text-center">
                        <a class="text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal"
                            v-on:click="toggleTabs(2)"
                            v-bind:class="{ 'text-white bg-emerald-600': openTab !== 2, 'text-emerald-600 bg-white': openTab === 2 }">
                            {{$t('labels.settings')}}
                        </a>
                    </li>
                </ul>
                <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                    <div class="px-4 py-5 flex-auto">
                        <div class="tab-content tab-space">
                            <div v-bind:class="{ 'hidden': openTab !== 1, 'block': openTab === 1 }">
                               <EntryList :uuid="$route.params.id" />
                            </div>
                            <div v-bind:class="{ 'hidden': openTab !== 2, 'block': openTab === 2 }">
                                <Setting :uuid="$route.params.id" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>

</template>

<script>
import '@vuepic/vue-datepicker/dist/main.css'
import ChartService from '@/services/chart.service';
import { useAppSettings } from '../../../storage/settings.store';
import MenuButton from '../../GenericComponents/MenuButton.vue';
import HeaderMenu from '../../Navbars/HeaderMenu.vue';
import CoreService from '../../../services/core.service';
import { getHeaderTokens } from '../../../utils/headers-token';
import Setting from '../../Budget/Setting.vue';
import EntryList from '../../Budget/EntryList.vue';

export default {
    components: {
        MenuButton, HeaderMenu, Setting, EntryList
    },
    setup() {
        const headers = getHeaderTokens()
        const coreService = new CoreService()
        const appSettings = useAppSettings()

        return {
            headers, coreService, appSettings
        }
    },
    data() {
        return {
            openTab: 1,
            input: {
                account: [],
                category: [],
                tags: [],
                emails: []
            },
            id: null,
            data: {
                account: [],
                category: [],
                label: [],
                type: [],
                period: null,
                period_start: null,
                period_end: null,
                amount: 0,
                name: null,
                note: null,
                notification: false,
                emails: []
            }
        }
    },
    created() {
        window.alert = (message, type = 'success') => {
            this.$refs.alertModal.show(message, type);
        };
    },
    mounted() {
        this.getCategory()
        this.getAccount()
        this.getLabels()
        this.id = this.$route.params.id
        this.getBudget()
        this.getEmails()
    },
    methods: {
        toggleTabs: function (tabNumber) {
            this.openTab = tabNumber
        },
        deleteBudget() {
            const chartService = new ChartService()
            chartService.deleteBudget(this.id)
            this.$router.push({ path: '/app/budgets' })
        },
        getBudget() {
            const _this = this
            const chartService = new ChartService()
            chartService.getBudget(this.id).then((resp) => {
                _this.data.name = resp.name
                _this.data.note = resp.description
                _this.data.amount = resp.amount
                _this.data.period = resp.configuration.period
                _this.data.account = resp.configuration.accounts
                _this.data.category = resp.configuration.categories
                _this.data.label = resp.configuration.tags
                _this.data.type = resp.configuration.types
                _this.data.notification = resp.notification
                _this.data.emails = resp.emails.length == 0 ? null : resp.emails
                _this.data.period_start = resp.configuration.period_start
                _this.data.period_end = resp.configuration.period_end
            })
        },
        getLabels() {
            let _this = this
            this.coreService.labels().then((res) => {
                let data = res
                data.forEach(function (r) {
                    _this.input.tags.push(r)
                })
            })
        },
        getCategory() {
            let _this = this
            this.coreService.subCategories().then((res) => {
                let data = res
                data.forEach(function (sub) {
                    _this.input.category.push({
                        id: sub.id,
                        name: _this.$t('app.' + sub.slug),
                    })
                })
                _this.input.category.sort(function (a, b) {
                    return a.name.localeCompare(b.name);
                });

            })
        },
        getAccount() {
            let _this = this
            this.coreService.accounts('?order[name]=asc').then((res) => {
                let data = res
                data.forEach(function (r) {
                    _this.input.account.push(r)
                })
            })
        },
        getEmails() {
            const storage = this.appSettings.getUser().shared_with
            storage.forEach((item) => {
                this.input.emails.push(item)
            })
        },
        set() {

            if (this.validate() === true) {
                const data = {
                    "name": this.data.name,
                    "amount": this.data.amount,
                    "description": this.data.note,
                    "configuration": {
                        "period": this.data.period,
                        "categories": this.data.category,
                        "tags": this.data.label,
                        "types": this.data.type,
                        "accounts": this.data.account,
                        "period_start": this.data.period_start,
                        "period_end": this.data.period_end,
                    },
                    "notification": this.data.notification,
                    "emails": this.data.emails,
                }

                const chartService = new ChartService()
                chartService.createBudget(data).then(() => {
                    //return
                    alert("Budget created", 'success')
                }).catch(() => {
                    alert("Error creating budget", 'error')
                })
            }
        },
        update() {
            if (this.validate() === true) {
                const data = {
                    "name": this.data.name,
                    "amount": this.data.amount,
                    "description": this.data.note,
                    "configuration": {
                        "period": this.data.period,
                        "categories": this.data.category,
                        "tags": this.data.label,
                        "types": this.data.type,
                        "accounts": this.data.account,
                        "period_start": this.data.period_start,
                        "period_end": this.data.period_end,
                    },
                    "notification": this.data.notification,
                    "emails": this.data.emails,
                }
                const chartService = new ChartService()
                chartService.updateBudget(data, this.id).then(() => {
                    //return
                    alert("Budget updated", 'success')
                }).catch(() => {
                    alert("Error updating budget", 'error')
                })
            }
        },

        validate() {
            if (this.data.period == "_") {
                alert("Please choose a right period", 'error')
                return false
            }

            if (this.data.amount == 0) {
                alert("Please insert a budget", 'error')
                return false
            }

            if (this.data.name == null) {
                alert("Please insert a budget name", 'error')
                return false
            }

            if (this.data.period == "one_shot" || this.data.period == "recursively") {

                if (this.data.period_start == null) {
                    alert("Please insert a start date for a budget", 'error')
                    return false
                }

                if (this.data.period_end == null) {
                    alert("Please insert a end date for a budget", 'error')
                    return false
                }

                // check if start date is less than end date
                if (this.data.period_start > this.data.period_end) {
                    alert("Start date must be less than end date", 'error')
                    return false
                }

            }

            return true
        }
    }
};

</script>

<style scoped>
.dp__input {
    border: none !important
}
</style>