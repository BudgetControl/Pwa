<template>
    <section class="relative py-16 bg-blueGray-200">
        <div class="container mx-auto px-4">
            <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
                <div
                    class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
                    <HeaderButton back="/app/settings/workspace" :title="$nextTick('labels.workspace_settings')" />

                    <div class="relative p-6 flex-auto">
                        <!-- Regular Input -->
                        <div class="mb-3 pt-0">
                            <input type="text" placeholder="Workspace name" v-model="modal.name"
                                class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:shadow-outline w-full" />
                        </div>

                        <div class="mb-3 pt-0">
                            <label for="exclude_stats">
                                {{ $t('labels.default_currency') }}
                                <select
                                    class="w-full border-0 px-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                    v-model="modal.currency">
                                    <option v-for="(item, k) in currencies" :key="k" :value="item.id">{{ item.name }}
                                    </option>
                                </select>
                            </label>
                        </div>

                        <div class="mb-3 pt-0">
                            <label for="exclude_stats">
                                {{ $t('labels.default_payment_type') }}
                                <select
                                    class="w-full border-0 px-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                                    v-model="modal.payment_type">
                                    <option v-for="(item, k) in payment_types" :key="k" :value="item.id">{{ item.name }}
                                    </option>
                                </select>
                            </label>
                        </div>

                        <div class="mb-3 pt-0 ">
                            <div>{{ $t('labels.share_workspace_with') }}</div>
                            <div class="flex">
                                <div class="lg:w-6/12 w-full">
                                    <input type="email" placeholder="exmail@example.com" v-model="shareEmail"
                                        class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:shadow-outline w-full" />
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
                                {{ $t('labels.worksace_whared_with') }}
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
                    <div class="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
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
import ApiServiceVue from '../../../services/ApiService.vue';
import WorkspaceService from '../../../services/WorkspaceService.vue';
import AuthServiceVue from '../../../services/AuthService.vue';
import LocalStorageServiceVue from '../../../services/LocalStorageService.vue';
import AlertModal from '../../../components/GenericComponents/AlertModal.vue';

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
                WorkspaceService.update(this.$route.params.id, this.modal).then(() => {
                    alert(this.$t('messages.workspace.updated'))
                    this.$router.push('/app/settings/workspace')
                })
            } else {
                WorkspaceService.add(this.modal).then(() => {
                    alert(this.$t('messages.workspace.added'))
                    this.$router.push('/app/settings/workspace')
                })
            }
        },
        getCurrencies() {
            ApiServiceVue.currencies().then((res) => {
                this.currencies = res.data
            })
        },
        getPaymentTypes() {
            ApiServiceVue.paymentstype().then((res) => {
                this.payment_types = res.data
            })
        },
        getWorkspaceDetail() {
            WorkspaceService.get(this.$route.params.id).then((res) => {
                this.modal.name = res.workspace.name
                this.modal.currency = res.settings.data.currency_id
                this.modal.payment_type = res.settings.data.payment_type_id
                res.workspace.users.forEach((item) => {
                    const user = LocalStorageServiceVue.getUser()
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
            if (this.shareEmail.length > 0 && this.shareEmail.includes('@') && this.shareEmail.includes('.') && this.shareEmail.length > 5) {
                AuthServiceVue.userInfoByEmail(this.shareEmail).then((res) => {
                    res.email = email
                    this.modal.shareWith.push(res)
                }).catch(() => {
                    alert(this.$t('messages.workspace.user_not_found'), 'error')
                })
            }
            this.shareEmail = ''
        }
    }
};
</script>