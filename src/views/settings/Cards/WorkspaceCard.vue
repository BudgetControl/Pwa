<template>
    <section class="relative py-16 bg-slate-200">
        <div class="container mx-auto px-4">
            <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg ">
                <div
                    class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
                    <HeaderButton back="/app/settings/workspace" :title="$t('labels.workspace_settings')" />

                    <div class="relative p-6 flex-auto">
                        <!-- Regular Input -->
                        <div class="mb-3 pt-0">
                            <input type="text" placeholder="Workspace name" v-model="modal.name"
                                class="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white bg-white rounded text-sm border border-slate-300 outline-none focus:outline-none focus:shadow-outline w-full" />
                        </div>

                        <div class="mb-3 pt-0">
                            <label for="exclude_stats">
                                {{ $t('labels.default_currency') }}
                                <select
                                    class="w-full border-0 px-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                    v-model="modal.currency">
                                    <option v-for="(item, k) in currencies" :key="k" :value="item.id">{{ $t('app.' + item.slug) }}
                                    </option>
                                </select>
                            </label>
                        </div>

                        <div class="mb-3 pt-0">
                            <label for="exclude_stats">
                                {{ $t('labels.default_payment_type') }}
                                <select
                                    class="w-full border-0 px-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                    v-model="modal.payment_type">
                                    <option v-for="(item, k) in payment_types" :key="k" :value="item.id">{{ $t('app.' + item.slug) }}
                                    </option>
                                </select>
                            </label>
                        </div>

                        <div class="mb-3 pt-0 ">
                            <div>{{ $t('labels.share_workspace_with') }}</div>
                            <div class="flex">
                                <div class="lg:w-6/12 w-full">
                                    <input type="email" placeholder="exmail@example.com" v-model="shareEmail"
                                        class="px-3 py-3 placeholder-slate-300 text-slate-600 relative bg-white bg-white rounded text-sm border border-slate-300 outline-none focus:outline-none focus:shadow-outline w-full" />
                                </div>
                                <div class="lg:w-6/12 px-2">
                                    <button
                                        class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button" v-on:click="share()">
                                        {{ $t('labels.share') }}
                                    </button>
                                </div>
                            </div>
                            <div class="container" v-if="modal.shareWith.length > 0">
                                {{ $t('labels.workspace_whared_with') }}
                                <ul>
                                    <li v-for="(user, i) in modal.shareWith" :key="i">
                                        <span
                                            class="text-xs font-semibold justify-center py-1 px-2 uppercase rounded text-white-600 last:mr-0 mr-1 text-emerald-600 bg-emerald-200"
                                            v-on:click="remove(modal.shareWith.indexOf(user.uuid))">{{ $t('labels.remove') }}</span>
                                        {{ user.name }}
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                    <!--footer-->

                    <div class="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                        <button
                            class="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button" v-on:click="deleteModal()">
                            {{ $t('labels.delete') }}
                        </button>

                        <button
                            class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button" v-on:click="saveModal()">
                            {{ $t('labels.save') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <AlertModal ref="alertModal" />
    </section>
</template>

<script>
import HeaderButton from '@/components/Button/HeaderButton.vue';
import '@vuepic/vue-datepicker/dist/main.css'
import AlertModal from '../../../components/GenericComponents/AlertModal.vue';
import WorkspaceService from '../../../services/workspace.service';
import CoreService from '../../../services/core.service';
import { useAppSettings } from '../../../storage/settings.store';
import AuthService from '../../../services/auth.service';

export default {
    components: {
        HeaderButton, AlertModal
    },
    data() {
        return {
            payment_types: [],
            currencies: [],
            shareEmail: '',
            modal: {
                name: '',
                archive: false,
                shareWith: [],
                currency: 2,
                payment_type: 'credit_card',
            }
        }
    },
    setup() {
        const appSettings = useAppSettings()

        return {
            appSettings
        }
    },
    mounted: function () {
        this.getCurrencies()
        this.getPaymentTypes()
        if (this.$route.params.id) {
            this.getWorkspaceDetail()
        }
    },
    created() {
        window.alert = (message, type = 'success') => {
            this.$refs.alertModal.show(message, type);
        };
    },
    methods: {
        saveModal() {
            if(this.$route.params.id) {
                const workspaceService = new WorkspaceService()
                workspaceService.update({
                    id: this.$route.params.id,
                    data: this.modal
                }).then(() => {
                    alert(this.$t('messages.workspace.updated'))
                    this.$router.push('/app/settings/workspace')
                })
            } else {
                const workspaceService = new WorkspaceService()
                workspaceService.add(this.modal).then(() => {
                    alert(this.$t('messages.workspace.added'))
                    this.$router.push('/app/settings/workspace')
                })
            }
        },
        getCurrencies() {
            const coreService = new CoreService()
            coreService.currencies().then((res) => {
                this.currencies = res
            })
        },
        getPaymentTypes() {
            const coreService = new CoreService()
            coreService.paymentstype().then((res) => {
                this.payment_types = res
            })
        },
        getWorkspaceDetail() {
            const workspaceService = new WorkspaceService()
                workspaceService.get(this.$route.params.id).then((res) => {
                this.modal.name = res.workspace.name
                this.modal.currency = res.settings.data.currency.id
                this.modal.payment_type = res.settings.data.paymenttypeId
                res.workspace.users.forEach((item) => {
                    const user = this.appSettings.settings.user
                    if(item.uuid !== user.uuid) {
                        this.modal.shareWith.push(item)
                    }
                })
            })
        },
        remove(i) {
            this.modal.shareWith.splice(i, 1)
        },
        share() {
            //check if is a valid email
            const email = this.shareEmail
            const authService = new AuthService()

            if (this.shareEmail.length > 0 && this.shareEmail.includes('@') && this.shareEmail.includes('.') && this.shareEmail.length > 5) {
                const authService = new AuthService()
                authService.userInfoByEmail(email).then((res) => {
                    this.modal.shareWith.push(res)
                }).catch(() => {
                    alert(this.$t('labels.user_not_found'), 'error')
                })
            }
            this.shareEmail = ''
        },
        deleteModal() {
            const workspaceService = new WorkspaceService()
            workspaceService.delete(this.$route.params.id).then(() => {
                alert(this.$t('messages.workspace.deleted'))
                this.$router.push('/app/settings/workspace')
            }).catch(() => {
                alert(this.$t('messages.generic_error'), 'error')
            })
        }
    }
};
</script>