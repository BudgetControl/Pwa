<template>
    <div class="p-6 bg-gray-100 min-h-screen">
        <!-- Intestazione desktop -->
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-800">{{ $t('labels.workspace_settings') }}</h1>
                <p class="text-gray-600 mt-1">{{ $t('labels.manage_your_workspaces') }}</p>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <button @click="openWorkspaceModal()"
                        class="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2">
                        <i class="fas fa-plus mr-2"></i>{{ $t('labels.add_new_workspace') }}
                    </button>
                </div>

                <!-- Lista workspace -->
                <div class="space-y-3">
                    <div v-for="(item, k) in workspaces" :key="k" v-on:click="openWorkspaceModal(item)"
                        class="flex items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <div class="flex items-center">
                            <i class="fas fa-briefcase text-emerald-500 mr-3"></i>
                            <span class="font-medium">{{ item.name }}</span>
                        </div>
                        <div class="ml-auto">
                            <i class="fas fa-chevron-right text-gray-400"></i>
                        </div>
                    </div>

                    <div v-if="workspaces.length === 0" class="text-center py-8 text-gray-500">
                        <i class="fas fa-folder-open text-4xl mb-3"></i>
                        <p>{{ $t('labels.no_workspaces_found') }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modale per aggiungere/modificare workspace -->
        <div v-if="showWorkspaceModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
            <div class="bg-white rounded-lg shadow-xl w-full max-w-xl mx-auto my-8 flex flex-col">
                <!-- Header sticky -->
                <div class="sticky top-0 bg-white p-6 border-b border-gray-200 z-10 flex justify-between items-center">
                    <h3 class="text-xl font-bold text-gray-800">
                        {{ editingWorkspace ? $t('labels.edit_workspace') : $t('labels.add_workspace') }}
                    </h3>
                    <button @click="closeWorkspaceModal" class="text-gray-400 hover:text-gray-600 p-2">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <!-- Contenuto scrollabile -->
                <div class="overflow-y-auto flex-1 p-6">
                    <div class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('labels.workspace_name')
                                }} *</label>
                            <input type="text" v-model="currentWorkspace.name"
                                class="w-full border-0 px-4 py-3 placeholder-slate-300 text-slate-600 bg-gray-50 rounded-lg text-sm shadow focus:outline-none focus:ring focus:ring-emerald-200"
                                :placeholder="$t('labels.workspace_name')" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('labels.default_currency')
                                }}</label>
                            <select v-model="currentWorkspace.currency"
                                class="w-full border-0 px-4 py-3 placeholder-slate-300 text-slate-600 bg-gray-50 rounded-lg text-sm shadow focus:outline-none focus:ring focus:ring-emerald-200">
                                <option v-for="item in currencies" :key="item.id" :value="item.id">{{ $t('app.' +
                                    item.slug) }}</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">{{
                                $t('labels.default_payment_type') }}</label>
                            <select v-model="currentWorkspace.payment_type"
                                class="w-full border-0 px-4 py-3 placeholder-slate-300 text-slate-600 bg-gray-50 rounded-lg text-sm shadow focus:outline-none focus:ring focus:ring-emerald-200">
                                <option v-for="item in payment_types" :key="item.id" :value="item.id">{{ $t('app.' +
                                    item.slug) }}</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">{{
                                $t('labels.share_workspace_with') }}</label>
                            <div class="flex gap-2">
                                <input type="email" v-model="shareEmail"
                                    class="flex-1 px-4 py-3 placeholder-slate-300 text-slate-600 bg-gray-50 rounded-lg text-sm border border-gray-300 focus:outline-none focus:ring focus:ring-emerald-200"
                                    :placeholder="$t('labels.enter_email')" />
                                <button @click="shareUser"
                                    class="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors">
                                    {{ $t('labels.share') }}
                                </button>
                            </div>
                            <div v-if="currentWorkspace.shareWith.length > 0" class="mt-2">
                                <span class="text-xs text-gray-500">{{ $t('labels.workspace_shared_with') }}:</span>
                                <ul class="mt-1">
                                    <li v-for="(user, i) in currentWorkspace.shareWith" :key="i"
                                        class="flex items-center gap-2">
                                        <span
                                            class="text-xs font-semibold py-1 px-2 rounded text-emerald-600 bg-emerald-100 cursor-pointer"
                                            @click="removeShare(i)">{{ $t('labels.remove') }}</span>
                                        {{ user.name }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Footer sticky -->
                <div class="sticky bottom-0 bg-white p-6 border-t border-gray-200 z-10">
                    <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                        <button @click="saveWorkspace"
                            class="flex-1 bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors font-medium">
                            {{ $t('labels.save') }}
                        </button>
                        <button @click="closeWorkspaceModal"
                            class="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                            {{ $t('labels.cancel') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <AlertModal ref="alertModal" />
    </div>
</template>

<script>

import '@vuepic/vue-datepicker/dist/main.css'
import AlertModal from '../../components/GenericComponents/AlertModal.vue';
import CoreService from "../../services/core.service";
import WorkspaceService from "../../services/workspace.service";
import AuthService from "../../services/auth.service";
import { useAppSettings } from '../../storage/settings.store';


export default {
    components: {
        AlertModal
    },
    data() {
        return {
            workspaces: [],
            showWorkspaceModal: false,
            editingWorkspace: false,
            currentWorkspace: {
                name: '',
                currency: null,
                payment_type: null,
                shareWith: [],
                uuid: null
            },
            currencies: [],
            payment_types: [],
            shareEmail: ''
        }
    },
    setup() {
        const appSettings = useAppSettings()
        return { appSettings }
    },
    mounted() {
        this.loadWorkspaces();
        this.getCurrencies();
        this.getPaymentTypes();
    },
    created() {
        window.alert = (message, type = 'success') => {
            this.$refs.alertModal.show(message, type);
        };
    },
    methods: {
        loadWorkspaces() {
            const WorkspaceServiceVue = new WorkspaceService()
            WorkspaceServiceVue.listByUser().then((res) => {
                this.workspaces = res
            })
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
        openWorkspaceModal(item = null) {
            if (item) {
                //get workspace details
                const workspaceService = new WorkspaceService();
                workspaceService.get(item.uuid).then((res) => {
                    //remove current user form shareWith
                    const userUuid = this.appSettings.settings.user.uuid;
                    res.workspace.users = res.workspace.users.filter(user => user.uuid !== userUuid);

                    this.currentWorkspace = res.workspace;
                    this.editingWorkspace = true;
                    this.showWorkspaceModal = true;
                    this.currentWorkspace.shareWith = res.workspace.users
                    this.currentWorkspace.currency = res.settings.data.currency.id
                    this.currentWorkspace.payment_type = res.settings.data.paymenttypeId;
                }).catch(() => {
                    alert(this.$t('messages.generic_error'), 'error');
                });
            } else {
                this.editingWorkspace = false;
                this.currentWorkspace = {
                    name: '',
                    currency: this.currencies.length ? this.currencies[0].id : null,
                    payment_type: this.payment_types.length ? this.payment_types[0].id : null,
                    shareWith: [],
                    uuid: null
                };
            }
            this.showWorkspaceModal = true;
        },
        closeWorkspaceModal() {
            this.showWorkspaceModal = false;
            this.editingWorkspace = false;
        },
        saveWorkspace() {
            if (!this.currentWorkspace.name) {
                alert(this.$t('messages.workspace_name_required'), 'error');
                return;
            }
            const workspaceService = new WorkspaceService();
            if (this.editingWorkspace && this.currentWorkspace.uuid) {
                workspaceService.update({
                    id: this.currentWorkspace.uuid,
                    data: {
                        name: this.currentWorkspace.name,
                        currency: this.currentWorkspace.currency,
                        payment_type: this.currentWorkspace.payment_type,
                        shareWith: this.currentWorkspace.shareWith
                    }
                }).then(() => {
                    alert(this.$t('messages.workspace.updated'), 'success');
                    this.loadWorkspaces();
                    this.closeWorkspaceModal();
                }).catch(() => {
                    alert(this.$t('messages.generic_error'), 'error');
                });
            } else {
                workspaceService.add({
                    workspace: {
                        name: this.currentWorkspace.name,
                        currency: this.currentWorkspace.currency,
                        payment_type: this.currentWorkspace.payment_type,
                    },
                    share_with: this.currentWorkspace.shareWith
                }).then(() => {
                    alert(this.$t('messages.workspace.added'), 'success');
                    this.loadWorkspaces();
                    this.closeWorkspaceModal();
                }).catch(() => {
                    alert(this.$t('messages.generic_error'), 'error');
                });
            }
        },
        shareUser() {
            const email = this.shareEmail;
            if (email.length > 0 && email.includes('@') && email.includes('.') && email.length > 5) {
                const service = new WorkspaceService();
                service.share(this.currentWorkspace.uuid, email).then((res) => {
                    this.currentWorkspace.shareWith.push(res);
                    alert(this.$t('labels.user_shared'), 'success');
                }).catch(() => {
                    alert(this.$t('labels.user_not_found'), 'error');
                });
            }
            this.shareEmail = '';
        },
        removeShare(i) {
            const service = new WorkspaceService();
            service.unshare(this.currentWorkspace.uuid, this.currentWorkspace.shareWith[i].uuid).then(() => {
                alert(this.$t('messages.workspace.user_unshared'), 'success');
            }).catch(() => {
                alert(this.$t('messages.generic_error'), 'error');
            });
            this.currentWorkspace.shareWith.splice(i, 1);
        },
        openModal(id) {
            if (id === null)
                this.$router.push({ path: `/app/settings/workspace/add` })
            else
                this.$router.push({ path: `/app/settings/workspace/edit/${id}` })
        },
    }
};
</script>

<style>
.vacp-color-input-group {
    display: none !important;
}

.vacp-copy-button {
    display: none !important;
}
</style>