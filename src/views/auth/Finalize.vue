<template>
    <div class="container mx-auto px-4 h-full">
        <loading :show="show">
        </loading>
        <div class="flex content-center items-center justify-center h-full">
            <div class="w-full lg:w-6/12 px-4">
                <div
                    class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-slate-200 border-0">
                    <div class="rounded-t mb-0 px-6 py-6">
                        <div class="text-center mb-3">
                            <h6 class="text-slate-500 text-sm font-bold">
                                {{ $t('labels.setup_account') }}
                            </h6>
                        </div>
                        <hr class="mt-6 border-b-1 border-slate-300" />
                    </div>
                    <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
                        <form @submit="finalize" action="javascript:void(0)">

                            <div role="alert" v-if="error">
                                <div class="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                                    {{ $t('labels.generic_error') }}
                                </div>
                                <div
                                    class="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                                    {{ error }}
                                </div>
                            </div>

                            <div role="alert" id="message" v-if="message">
                                <div
                                    class="border border-t-0 border-sky-400 rounded-b bg-sky-100 px-4 py-3 text-sky-700">
                                    ! {{ message }}.
                                </div>
                            </div>

                            <div v-if="!message">
                                <div class="relative w-full mb-3">
                                    <label class="block uppercase text-slate-600 text-xs font-bold mb-2"
                                        htmlFor="grid-password">
                                        {{ $t('labels.workspace_name') }}
                                    </label>
                                    <input v-model="workspace_name" type="text"
                                        class="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        placeholder="" />
                                </div>

                                <div class="relative w-full mb-3">
                                    <label class="block uppercase text-slate-600 text-xs font-bold mb-2"
                                        htmlFor="grid-password">
                                        {{ $t('labels.default_currency') }}
                                    </label>
                                    <Currencies v-model="currency"></Currencies>
                                </div>

                                <div class="relative w-full mb-3">
                                    <label class="block uppercase text-slate-600 text-xs font-bold mb-2"
                                        htmlFor="grid-password">
                                        {{ $t('labels.default_payment_type') }}
                                    </label>
                                    <PaymentTypes v-model="paymentType"></PaymentTypes>
                                </div>

                                <div class="relative w-full mb-3">
                                    <label class="block uppercase text-slate-600 text-xs font-bold mb-2"
                                        htmlFor="grid-password">
                                        {{ $t('labels.first_wallet_name') }}
                                    </label>
                                    <input v-model="first_wallet_name" type="text"
                                        class="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        placeholder="" />
                                </div>

                                <div class="relative w-full mb-3">
                                    <label class="block uppercase text-slate-600 text-xs font-bold mb-2"
                                        htmlFor="grid-password">
                                        {{ $t('labels.wallet_type') }}
                                    </label>
                                    <select
                                        class="w-full border-0 px-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                        v-model="wallet_type">
                                        <option value="0">{{ $t('labels.choose_wallet_type') }}</option>
                                        <option v-for="(item, k) in form.type" :key="k" :value="item">{{
                                            $t('app.bank_accounts.' + item) }}
                                        </option>
                                    </select>
                                </div>

                                <div class="relative w-full mb-3">
                                    <label class="block uppercase text-slate-600 text-xs font-bold mb-2"
                                        htmlFor="grid-password">
                                        {{ $t('labels.wallet_amount') }}
                                    </label>
                                    <Amount v-model="amount"></Amount>
                                </div>

                                <div class="text-center mt-6">
                                    <button
                                        class="bg-slate-800 text-white active:bg-slate-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                                        type="submit">
                                        {{ $t('labels.save') }}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import AuthService from "../../services/auth.service";
import loading from 'vue-full-loading'
import PaymentTypes from "../../components/Select/PaymentTypes.vue";
import Currencies from "../../components/Select/Currencies.vue";
import Amount from "../../components/Input/Amount.vue";
import WorkspaceService from "../../services/workspace.service";
import CoreService from "../../services/core.service";
import { useAppSettings } from "../../storage/settings.store";

export default {
    components: {
        loading, PaymentTypes, Currencies, Amount
    },
    setup() {
    const authService = new AuthService()
        const workspaceService = new WorkspaceService()
        const coreService = new CoreService()
        const appSettings = useAppSettings()
        return {
            appSettings, authService, workspaceService, coreService
        }
    },
    data() {
        return {
            show: false,
            error: false,
            error_message: null,
            form: {
                type: ['bank', 'cache', 'other'],
            },
            workspace_name: '',
            first_wallet_name: '',
            wallet_type: 0,
            amount: '0.00',
            currency: 2,
            paymentType: 1,
            currentWalletId: null
        };
    },
    async mounted() {
        //get current wallet ID
        const currentWallet = await this.coreService.accounts()
        this.currentWalletId = currentWallet[0].uuid
    },
    methods: {
        async finalize() {
            const _this = this

            const workspaceData = {
                name: this.workspace_name,
                currency: this.currency,
                payment_type: this.paymentType
            }

            const walletData = {
                name: this.first_wallet_name,
                amount: this.amount,
                type: this.wallet_type
            }

            const wallet = await this.coreService.setAccount(walletData, this.currentWalletId);
            const workspace = await this.workspaceService.update({
                id: this.appSettings.settings.current_ws.uuid,
                data: workspaceData
            });

            try {
                if (workspace && wallet) {
                    //refresh user info data
                    this.authService.userInfo().then(() => {
                        _this.$router.push({ path: '/app/dashboard' })
                    })
                } else {
                    throw new Error('Error on save data')
                }

            } catch (error) {
                console.error(error)
                _this.error = true
                _this.error_message = $t('labels.generic_error')
            }

        }
    }
};
</script>