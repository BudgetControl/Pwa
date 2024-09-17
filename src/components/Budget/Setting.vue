<template>
    <div>
        <form>
            <div
                class="container relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0 flex-auto p-4">

                <div class="flex flex-wrap py-3">

                    <div class="w-full lg:w-12/12 px-4">

                        <div
                            class="container relative flex flex-col min-w-0 break-words w-full mb-6 rounded-lg border-0 flex-auto p-4">


                            <div class="flex flex-wrap">
                                <div class="lg:w-4/12 px-2 py-2 w-full">
                                    <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                        htmlFor="grid-password">
                                        {{ $t('labels.budget_name') }}
                                    </label>
                                    <input type="text" v-model="data.name" placeholder="Budget name"
                                        class="w-full border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
                                </div>
                                <div class="lg:w-4/12 px-2 py-2 w-full">
                                    <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                        htmlFor="grid-password">
                                        {{ $t('labels.budget') }}
                                    </label>
                                    <input v-model="data.amount" type="tel" placeholder="0,00 €" id="amount"
                                        class="w-full border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                                </div>
                                <div class="lg:w-4/12 px-2 py-2 w-full">
                                    <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                        htmlFor="grid-password">
                                        {{ $t('labels.period') }}
                                    </label>
                                    <select v-model="data.period" id="planning"
                                        class="w-full border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                                        <option value="_"> {{ $t('labels.choose_period') }}</option>
                                        <option value="weekly"> {{ $t('labels.weekly') }}</option>
                                        <option value="monthly"> {{ $t('labels.monthly') }}</option>
                                        <option value="yearly">{{ $t('labels.yearly') }}</option>
                                        <option value="one_shot"> {{ $t('labels.one_shot') }}</option>
                                        <option value="recursively"> {{ $t('labels.recursive') }}</option>
                                    </select>
                                </div>
                            </div>

                            <div class="flex flex-wrap"
                                v-if="data.period == 'one_shot' || data.period == 'recursively'">
                                <div class="lg:w-6/12 px-2 py-2 w-full">

                                    <label class="bl}ock uppercase text-blueGray-600 text-xs font-bold mb-2"
                                        htmlFor="grid-password">
                                        {{ $t('labels.start_Date') }}
                                    </label>

                                    <VueDatePicker v-model="data.period_start"></VueDatePicker>
                                </div>

                                <div class="lg:w-6/12 px-2 py-2 w-full">

                                    <label class="bl}ock uppercase text-blueGray-600 text-xs font-bold mb-2"
                                        htmlFor="grid-password">
                                        {{ $t('labels.end_date') }}
                                    </label>

                                    <VueDatePicker v-model="data.period_end"></VueDatePicker>

                                </div>

                            </div>

                            <div class="flex flex-wrap">
                                <div class="lg:w-6/12 px-2 py-2 w-full">
                                    <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                        htmlFor="grid-password">
                                        {{ $t('labels.account') }}
                                    </label>
                                    <select multiple
                                        class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        v-model="data.account">
                                        <option v-for="account in input.account" :key="account.id" :value="account.id">
                                            {{
                                                account.name
                                            }}</option>
                                    </select>

                                </div>

                                <div class="lg:w-6/12 px-2 py-2 w-full">

                                    <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                        htmlFor="grid-password">
                                        {{ $t('labels.category') }}
                                    </label>
                                    <select multiple
                                        class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        v-model="data.category">
                                        <option v-for="category in input.category" :key="category.id"
                                            :value="category.id">
                                            {{ category.name }}
                                        </option>
                                    </select>

                                </div>

                            </div>

                            <div class="flex flex-wrap">
                                <div class="lg:w-6/12 px-2 py-2 w-full">

                                    <label class="bl}ock uppercase text-blueGray-600 text-xs font-bold mb-2"
                                        htmlFor="grid-password">
                                        {{ $t('labels.label') }}
                                    </label>
                                    <select v-model="data.label" multiple
                                        class="w-full border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                                        <option
                                            class="text-xs font-semibold justify-center py-1 px-2 uppercase rounded text-white-600 last:mr-0 mr-1"
                                            v-for="item in input.tags" :key="item.id" :value="item.id">
                                            {{ item.name }}
                                        </option>
                                    </select>

                                </div>

                                <div class="lg:w-6/12 px-2 py-2 w-full">

                                    <label class="bl}ock uppercase text-blueGray-600 text-xs font-bold mb-2"
                                        htmlFor="grid-password">
                                        {{ $t('labels.entry_type') }}
                                    </label>

                                    <select v-model="data.type" multiple
                                        class="w-full border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                                        <option
                                            class="text-xs font-semibold justify-center py-1 px-2 uppercase rounded text-white-600 last:mr-0 mr-1"
                                            value="incoming"> {{ $t('labels.incoming') }}
                                        </option>

                                        <option
                                            class="text-xs font-semibold justify-center py-1 px-2 uppercase rounded text-white-600 last:mr-0 mr-1"
                                            value="expenses"> {{ $t('labels.expenses') }}
                                        </option>

                                        <option
                                            class="text-xs font-semibold justify-center py-1 px-2 uppercase rounded text-white-600 last:mr-0 mr-1"
                                            value="debit"> {{ $t('labels.debit') }}
                                        </option>

                                        <option
                                            class="text-xs font-semibold justify-center py-1 px-2 uppercase rounded text-white-600 last:mr-0 mr-1"
                                            value="transfer"> {{ $t('labels.transfer') }}
                                        </option>
                                    </select>

                                </div>

                            </div>

                            <div class="flex flex-wrap">
                                <div class="lg:w-12/12 px-2 py-2 w-full">
                                    <label class="bl}ock uppercase text-blueGray-600 text-xs font-bold mb-2"
                                        htmlFor="grid-password">
                                        Note
                                    </label>

                                    <textarea v-model="data.note"
                                        class="w-full border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        rows="4" />
                                </div>
                            </div>

                            <div class="flex flex-wrap py-3">
                                <div class="lg:w-12/12 px-2 w-full">
                                    <input id="vue-checkbox-list" type="checkbox" v-model="data.notification"
                                        :checked="data.notification" value="true"
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                                    <label for="vue-checkbox-list"
                                        class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                        {{ $t('labels.enable_email_notification') }}</label>
                                </div>
                            </div>

                            <div class="flex flex-wrap py-3" v-if="data.notification">
                                <div class="lg:w-12/12 px-2 w-full">

                                    <select v-model="data.emails" multiple
                                        class="w-full border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                                        <option v-for="(email, id) in input.emails" :key="id" :value="email.email"
                                            class="text-xs font-semibold justify-center py-1 px-2 uppercase rounded text-white-600 last:mr-0 mr-1">
                                            {{ email.name }}
                                        </option>
                                    </select>

                                </div>
                            </div>

                            <div class="flex flex-wrap py-3">
                                <div class="lg:w-12/12 px-2 w-full">
                                    <button v-on:click="set()" v-if="!id"
                                        class="w-full bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button">
                                        {{ $t('labels.save') }}
                                    </button>

                                    <button v-on:click="update()" v-if="id"
                                        class="w-full bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button">
                                        {{ $t('labels.update') }}
                                    </button>

                                    <button v-on:click="deleteBudget()" v-if="id"
                                        class="w-full bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button">
                                        {{ $t('labels.delete') }}
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <AlertModal ref="alertModal" />
        </form>
    </div>

</template>

<script>
import '@vuepic/vue-datepicker/dist/main.css'
import ApiService from '../../services/ApiService.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import LocalStorageServiceVue from '../../services/LocalStorageService.vue';
import BudgetService from '../../services/BudgetService.vue';
import AlertModal from '../GenericComponents/AlertModal.vue';

export default {
    components: {
        VueDatePicker, AlertModal
    },
    props: {
        uuid: {
            type: String,
            default: null,
            required: true
        }
    },
    data() {
        return {
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
        deleteBudget() {
            BudgetService.deleteBudget(this.id)
            this.$router.push({ path: '/app/budgets' })
        },
        getBudget() {
            const _this = this
            BudgetService.getBudget(this.id).then((resp) => {
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
            ApiService.labels().then((res) => {
                let data = res
                data.forEach(function (r) {
                    _this.input.tags.push(r)
                })
            })
        },
        getCategory() {
            let _this = this
            ApiService.subCategories().then((res) => {
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
            ApiService.accounts('?order[name]=asc').then((res) => {
                let data = res
                data.forEach(function (r) {
                    _this.input.account.push(r)
                })
            })
        },
        getEmails() {
            const storage = LocalStorageServiceVue.getUser().shared_with
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

                BudgetService.createBudget(data).then(() => {
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
                BudgetService.updateBudget(data, this.id).then(() => {
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