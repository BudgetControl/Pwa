<template>
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
                                    Budget name
                                </label>
                                <input type="text" v-model="data.name" placeholder="Budget name"
                                    class="w-full border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
                            </div>
                            <div class="lg:w-4/12 px-2 py-2 w-full">
                                <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                    htmlFor="grid-password">
                                    Budget
                                </label>
                                <input v-model="data.amount" type="tel" placeholder="0,00 €" id="amount"
                                    class="w-full border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                            </div>
                            <div class="lg:w-4/12 px-2 py-2 w-full">
                                <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                    htmlFor="grid-password">
                                    Period
                                </label>
                                <select v-model="data.period" id="planning"
                                    class="w-full border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                                    <option value="_">Choose a period</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">monthly</option>
                                    <option value="yearly">yearly</option>
                                    <option value="one_shot">one shot</option>
                                </select>
                            </div>
                        </div>

                        <div class="flex flex-wrap" v-if="data.period == 'one_shot'">
                            <div class="lg:w-6/12 px-2 py-2 w-full">

                                <label class="bl}ock uppercase text-blueGray-600 text-xs font-bold mb-2"
                                    htmlFor="grid-password">
                                    Start date
                                </label>

                                <VueDatePicker v-model="start_date"></VueDatePicker>
                            </div>

                            <div class="lg:w-6/12 px-2 py-2 w-full">

                                <label class="bl}ock uppercase text-blueGray-600 text-xs font-bold mb-2"
                                    htmlFor="grid-password">
                                    End date
                                </label>

                                <VueDatePicker v-model="data.end_date"></VueDatePicker>

                            </div>

                        </div>

                        <div class="flex flex-wrap">
                            <div class="lg:w-6/12 px-2 py-2 w-full">
                                <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                    htmlFor="grid-password">
                                    Account
                                </label>
                                <select multiple
                                    class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                    v-model="data.account">
                                    <option v-for="account in input.account" :key="account.id" :value="account.id">{{
                                        account.name
                                    }}</option>
                                </select>

                            </div>

                            <div class="lg:w-6/12 px-2 py-2 w-full">

                                <label class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                                    htmlFor="grid-password">
                                    Category
                                </label>
                                <select multiple
                                    class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                    v-model="data.category">
                                    <option v-for="category in input.category" :key="category.id" :value="category.id">{{
                                        category.name
                                    }}
                                    </option>
                                </select>

                            </div>

                        </div>

                        <div class="flex flex-wrap">
                            <div class="lg:w-6/12 px-2 py-2 w-full">

                                <label class="bl}ock uppercase text-blueGray-600 text-xs font-bold mb-2"
                                    htmlFor="grid-password">
                                    Label
                                </label>
                                <select v-model="data.tags" multiple
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
                                    Entry type
                                </label>

                                <select v-model="data.type" multiple
                                    class="w-full border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150">
                                    <option
                                        class="text-xs font-semibold justify-center py-1 px-2 uppercase rounded text-white-600 last:mr-0 mr-1"
                                        value="incoming"> incoming
                                    </option>

                                    <option
                                        class="text-xs font-semibold justify-center py-1 px-2 uppercase rounded text-white-600 last:mr-0 mr-1"
                                        value="expenses"> expenses
                                    </option>

                                    <option
                                        class="text-xs font-semibold justify-center py-1 px-2 uppercase rounded text-white-600 last:mr-0 mr-1"
                                        value="debit"> debit
                                    </option>

                                    <option
                                        class="text-xs font-semibold justify-center py-1 px-2 uppercase rounded text-white-600 last:mr-0 mr-1"
                                        value="transfer"> transfer
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
                                    class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"> Enable
                                    email notification</label>
                            </div>
                        </div>

                        <div class="flex flex-wrap py-3">
                            <div class="lg:w-12/12 px-2 w-full">
                                <button v-on:click="set()" v-if="!id"
                                    class="w-full bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button">
                                    SAVE BUDGET
                                </button>

                                <button v-on:click="update()" v-if="id"
                                    class="w-full bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button">
                                    UPDATE BUDGET
                                </button>

                                <button v-on:click="deleteBudget()" v-if="id"
                                    class="w-full bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    type="button">
                                    DELETE BUDGET
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

        </div>
    </form>
</template>
  
<script>
import '@vuepic/vue-datepicker/dist/main.css'
import ApiService from '../../../services/ApiService.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import ChartServiceVue from '../../../services/ChartService.vue';

export default {
    components: {
        VueDatePicker
    },
    data() {
        return {
            input: {
                account: [],
                category: [],
                tags: [],
            },
            id: null,
            data: {
                account: [],
                category: [],
                label: [],
                type: [],
                period: null,
                start_date: null,
                end_date: null,
                amount: 0,
                name: null,
                note: null,
                notification: false,
            }
        }
    },
    mounted() {
        this.getCategory()
        this.getAccount()
        this.getLabels()
        this.id = this.$route.params.id
        this.getBudget()
    },
    methods: {
        deleteBudget() {
            ChartServiceVue.deleteBudget(this.id)
            this.$router.push({ path: '/app/budgets' })
        },
        getBudget() {
            const _this = this
            ChartServiceVue.getBudget(this.id).then((resp) => {
                _this.data.name = resp.config.name
                _this.data.note = resp.config.note
                _this.data.amount = resp.budget
                _this.data.period = resp.config.period
                _this.data.account = resp.config.account
                _this.data.category = resp.config.category
                _this.data.label = resp.config.label
                _this.data.type = resp.config.type
                _this.data.notification = resp.notification
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
            ApiService.categories().then((res) => {
                let data = res
                data.forEach(function (r) {
                    r.sub_category.forEach((item) => {
                        _this.input.category.push(item)
                    })
                })
                _this.input.category.sort(function (a, b) {
                    return a.name.localeCompare(b.name);
                });
            })
        },
        getAccount() {
            let _this = this
            ApiService.accounts().then((res) => {
                let data = res
                data.forEach(function (r) {
                    _this.input.account.push(r)
                })
            })
        },
        set() {

            if (this.validate() === true) {
                const data = this.data
                const _this = this
                ChartServiceVue.createBudget(data).then(() => {
                    //return
                    _this.$router.push({ path: '/app/budgets' })
                })
            }
        },
        update() {
            if (this.validate() === true) {
                const data = this.data
                const _this = this
                ChartServiceVue.updateBudget(data,this.id).then(() => {
                    //return
                    _this.$router.push({ path: '/app/budgets' })
                })
            }
        },

        validate() {
            if (this.data.period == "_") {
                alert("Please choose a right period")
                return false
            }

            if (this.data.amount == 0) {
                alert("Please insert a budget")
                return false
            }

            if (this.data.name == null) {
                alert("Please insert a budget name")
                return false
            }

            if (this.data.period == "one_shot") {

                if (this.data.start_date == null) {
                    alert("Please insert a start date for a budget")
                    return false
                }

                if (this.data.end_date == null) {
                    alert("Please insert a end date for a budget")
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