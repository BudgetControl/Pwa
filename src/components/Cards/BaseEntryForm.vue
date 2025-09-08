<template>
    <form>
        <div :class="containerClass"
            class="container relative flex flex-col min-w-0 break-words w-full mb-6 rounded-lg border-0 flex-auto p-4">


            <!-- Selector per modelli - solo se non è un model, non è planned, e ci sono modelli disponibili -->
            <div v-if="!isModel && !isPlanned && models.length > 0 && (entryType === 'expenses' || entryType === 'incoming')" class="flex flex-wrap -mx-2">
                <div class="w-full px-2 py-2">
                    <select v-model="selectedModel" @change="loadModelData"
                        class="w-full border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150">
                        <option value="0">{{ $t('labels.choose_a_model') }}</option>
                        <option v-for="item in models" :key="item.uuid" :value="item.uuid">{{ item.name }}</option>
                    </select>
                </div>
            </div>

            <!-- Suggerimento per creare modelli se non ce ne sono -->
            <div v-if="!isModel && !isPlanned && models.length === 0 && (entryType === 'expenses' || entryType === 'incoming')" class="flex flex-wrap -mx-2">
                <div class="w-full px-2 py-2">
                        <router-link 
                            to="/app/settings/model/add?showDetails=true" 
                            class="bg-emerald-600 w-full text-center inline-block bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 transition-colors">
                            <i class="fas fa-plus mr-2"></i>
                            {{ $t('labels.create_first_model') }}
                        </router-link>
                </div>
            </div>


            <!-- Prima riga: campi specifici del tipo -->
            <div class="flex flex-wrap -mx-2">
                <!-- Slot per campi specifici del tipo -->
                <slot name="specific-fields"></slot>
            </div>

            <!-- Seconda riga: Amount e Currency -->
            <div class="flex flex-wrap -mx-2">
                <div class="w-full lg:w-6/12 px-2 py-2">
                    <Amount v-model="formData.amount" :placeholder="'0'" :min="0.01" />
                </div>

                <div v-if="showDetails" class="w-full lg:w-6/12 px-2 py-2">
                    <CurrencySelector v-model="formData.currency_id" :currencies="currencies"
                        :required="true" :has-error="validationErrors.currency_id" />
                </div>
            </div>

            <!-- Campi specifici per planned entries -->
            <div v-if="isPlanned" class="flex flex-wrap -mx-2">
                <div class="w-full px-2 py-2">
                    <select v-model="formData.planning"
                        class="w-full border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150">
                        <option value="0">{{ $t('labels.choose_planned_type') }}</option>
                        <option v-for="(item, k) in planningOptions" :key="k" :value="item">{{ $t('labels.' + item) }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- Date per planned entries - in una riga separata -->
            <div v-if="isPlanned" class="flex flex-wrap -mx-2">
                <div class="w-full lg:w-6/12 px-2 py-2">
                    <label class="block uppercase text-slate-600 text-xs font-bold mb-2">
                        {{ $t('labels.date_start') }}
                    </label>
                    <Calendar v-model="formData.date" :label="''" />
                </div>

                <div class="w-full lg:w-6/12 px-2 py-2">
                    <label class="block uppercase text-slate-600 text-xs font-bold mb-2">
                        {{ $t('labels.date_end') }}
                    </label>
                    <Calendar v-model="formData.end_date_time" :label="''" />
                </div>
            </div>

            <!-- Pulsante show details solo su mobile -->
            <div v-if="!showDetails" class="w-full px-2 py-2">
                <button @click="showDetails = true"
                    class="w-full text-xs py-1 bg-yellow-500 text-white active:bg-amber-600 font-bold uppercase rounded shadow hover:shadow-md outline-none focus:outline-none ease-linear transition-all duration-150"
                    type="button">
                    {{ $t('labels.show_details') }}
                </button>
            </div>

            <!-- Sezione dettagli -->
            <div v-if="showDetails" class="flex flex-wrap -mx-2 py-3">
                <div class="w-full px-2 ">
                    <LabelSelector v-model="formData.labels" :available-labels="availableLabels"
                        @new-label="handleNewLabel" />
                </div>

                <!-- Checkbox per exclude_from_stats -->
                <CheckboxButton @update:active="formData.exclude_from_stats = !formData.exclude_from_stats"
                    :status="formData.exclude_from_stats" :label="$t('labels.exclude_from_stats')" />

                <div class="w-full px-2 py-2">
                    <PaymentTypeSelector v-model="formData.payment_type" :payment-types="paymentTypes" />
                </div>

                <div v-if="!isModel && !isPlanned" class="w-full px-2 py-2">
                    <Calendar v-model="formData.date_time" />
                </div>

                <div class="w-full px-2 py-2">
                    <TextNote v-model="formData.note" :placeholder="$t('labels.add_here_your_note')" />
                </div>
            </div>
        </div>

        <div class="w-full px-2">
            <Buttons v-if="!isModel && !isPlanned" @set="handleSubmit" />

            <!-- Pulsante specifico per modelli -->
            <button v-if="isModel" @click="handleSubmit"
                class="w-full bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button">
                {{ $t('labels.save_template') }}
            </button>

            <!-- Pulsante specifico per voci pianificate -->
            <button v-if="isPlanned" @click="handleSubmit"
                class="w-full bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button">
                {{ $t('labels.insert_new_planned_entry') }}
            </button>
        </div>

        <AlertModal ref="alertModal" />
    </form>
</template>

<script>
import Amount from '../Input/Amount.vue';
import TextNote from '../Input/TextNote.vue';
import Calendar from '../Input/Calendar.vue';
import Buttons from '../Input/Buttons.vue';
import PaymentTypeSelector from '../Input/PaymentTypeSelector.vue';
import LabelSelector from '../Input/LabelSelector.vue';
import AlertModal from '../GenericComponents/AlertModal.vue';
import CheckboxButton from '../Button/CheckboxButton.vue';
import CurrencySelector from '../Input/CurrencySelector.vue';
import { useAppSettings } from '../../storage/settings.store';

export default {
    name: 'BaseEntryForm',
    components: {
        Amount,
        TextNote,
        Calendar,
        Buttons,
        PaymentTypeSelector,
        LabelSelector,
        AlertModal,
        CheckboxButton,
        CurrencySelector
    },
    props: {
        entryType: {
            type: String,
            required: true
        },
        isModel: {
            type: Boolean,
            default: false
        },
        isPlanned: {
            type: Boolean,
            default: false
        },
        currencies: {
            type: Array,
            default: () => []
        },
        paymentTypes: {
            type: Array,
            default: () => []
        },
        availableLabels: {
            type: Array,
            default: () => []
        },
        entryId: {
            type: String,
            default: null
        },
        models: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            showDetails: false,
            planningOptions: ["daily", "monthly", "yearly"],
            newLabels: [],
            selectedModel: "0",
            validationErrors: {},
            formData: {
                amount: null,
                currency_id: 1,
                payment_type: 1,
                date_time: null,
                note: null,
                planning: 0,
                end_date_time: null,
                labels: [],
                uuid: null,
                transfer_id: false,
                confirmed: true,
                waranty: false,
                geolocalization: "",
                exclude_from_stats: false
            }
        }
    },
    setup() {
        const appSettings = useAppSettings();
        return { appSettings };
    },
    computed: {
        containerClass() {
            const classes = {
                'expenses': 'bg-red-200',
                'incoming': 'bg-sky-200',
                'transfer': 'bg-amber-200',
                'debit': 'bg-blueGray-200',
                'saving': 'bg-emerald-200'
            }
            return classes[this.entryType] || 'bg-gray-200'
        },
        isMobile() {
            return window.innerWidth <= 768
        }
    },
    mounted() {
        this.time()
        this.setInitialShowDetails()
        
        // Se è in modalità edit, carica i dati
        if (this.entryId) {
            this.loadEntryData()
        }

        const currency = this.appSettings.getCurrencyId()
        this.formData.currency_id = currency
    },
    methods: {
        time() {
            let dateTime = new Date()
            this.formData.date_time = dateTime.toISOString().split('T')[0] + " " + dateTime.toLocaleTimeString()
        },
        setInitialShowDetails() {
            // Su desktop mostra sempre i dettagli, su mobile no
            this.showDetails = !this.isMobile
        },
        showAlert(message, type = 'error') {
            this.$refs.alertModal.show(message, type)
        },
        validateAmount() {
            return this.formData.amount && this.formData.amount > 0
        },
        validatePlannedFields() {
            if (!this.isPlanned) return true

            const errors = []

            if (!this.formData.planning || this.formData.planning === 0) {
                errors.push(this.$t('messages.validation.choose_planned_type'))
            }

            if (!this.formData.date) {
                errors.push(this.$t('messages.validation.choose_start_date'))
            }

            if (this.formData.end_date_time && this.formData.date && this.formData.end_date_time < this.formData.date) {
                errors.push(this.$t('messages.validation.end_date_greater_than_start_date'))
            }

            if (errors.length > 0) {
                this.showAlert(errors.join(', '), 'error')
                return false
            }

            return true
        },

        handleNewLabel(newLabel) {
            console.log('New label received in BaseEntryForm:', newLabel) // Debug
            console.log('Current newLabels array:', this.newLabels) // Debug
            console.log('Current formData.labels:', this.formData.labels) // Debug
            
            // Aggiungi la nuova etichetta all'array delle nuove etichette
            this.newLabels.push(newLabel)
            
            // Assicurati che l'ID della nuova etichetta sia incluso nei labels del form
            if (!this.formData.labels.includes(newLabel.id)) {
                this.formData.labels.push(newLabel.id)
            }
            
            console.log('Updated newLabels array:', this.newLabels) // Debug
            console.log('Updated formData.labels:', this.formData.labels) // Debug
            
            // Emetti l'evento per notificare il componente padre
            this.$emit('new-label-created', newLabel)
        },

        formatLabelsForSubmission() {
            const labels = []
            
            console.log('Formatting labels for submission:', [...this.formData.labels]) // Debug
            console.log('Available new labels:', [...this.newLabels]) // Debug

            // Prima aggiungi le etichette esistenti selezionate
            if (this.formData.labels && this.formData.labels.length > 0) {
                this.formData.labels.forEach(labelId => {
                    console.log('Processing label ID:', labelId) // Debug
                    
                    // Controlla se è una nuova etichetta temporanea
                    const newLabel = this.newLabels.find(nl => nl.id === labelId)
                    if (newLabel) {
                        console.log('Found new label:', newLabel) // Debug
                        // Nuova etichetta: invia nome e colore
                        labels.push({
                            name: newLabel.name,
                            color: newLabel.color
                        })
                    } else {
                        // Etichetta esistente: invia ID numerico come name, color null
                        const numericId = parseInt(labelId)
                        if (!isNaN(numericId)) {
                            console.log('Found existing label:', numericId) // Debug
                            labels.push({
                                name: numericId,
                                color: null
                            })
                        }
                    }
                })
            }
            
            console.log('Final formatted labels:', labels) // Debug
            return labels
        },

        formatDateTimeForSubmission(dateValue) {
            if (!dateValue) return null

            // Se è già in formato ISO, ritorna così com'è
            if (typeof dateValue === 'string' && dateValue.includes('T')) {
                return dateValue
            }

            // Se è un oggetto Date, convertilo
            if (dateValue instanceof Date) {
                return dateValue.toISOString()
            }

            // Se è una stringa con formato "YYYY-MM-DD HH:mm:ss", convertila
            if (typeof dateValue === 'string') {
                // Prova a parsare la data
                const date = new Date(dateValue)
                if (!isNaN(date.getTime())) {
                    return date.toISOString()
                }
            }

            return null
        },

        handleSubmit() {
            if (!this.validateAmount()) {
                this.showAlert(this.$t('messages.validation.insert_amount'), 'error')
                return
            }

            if (!this.validatePlannedFields()) {
                return
            }

            // Formatta le etichette nella struttura corretta
            const formattedLabels = this.formatLabelsForSubmission()

            // Formatta le date nella struttura corretta
            const formattedDateTime = this.formatDateTimeForSubmission(this.formData.date_time)
            const formattedEndDateTime = this.formData.end_date_time ? this.formatDateTimeForSubmission(this.formData.end_date_time) : null

            // Includi tutti i campi richiesti nei dati del form
            const submitData = {
                amount: this.formData.amount,
                note: this.formData.note || null,
                labels: formattedLabels,
                currency_id: parseInt(this.formData.currency_id),
                payment_type: parseInt(this.formData.payment_type),
                transfer_id: this.formData.transfer_id,
                date_time: formattedDateTime,
                confirmed: this.formData.confirmed,
                waranty: this.formData.waranty,
                geolocalization: this.formData.geolocalization || "",
                planning: this.formData.planning,
                end_date_time: formattedEndDateTime,
                exclude_from_stats: this.formData.exclude_from_stats,
                name: this.isModel ? this.name : null
            }

            console.log('Final submit data:', submitData) // Debug

            // Passa la validazione al componente padre
            this.$emit('validate-and-submit', submitData)
        },

        async loadEntryData() {
            try {
                const CoreService = (await import('../../services/core.service')).default
                const apiService = new CoreService()
                
                // Usa il metodo appropriato in base al tipo di entry
                if (this.isModel) {
                    const entryData = await apiService.getModel(this.entryId)
                    this.populateForm(entryData)
                } else {
                    const entryData = await apiService.getEntryDetail(this.entryId, this.isPlanned)
                    this.populateForm(entryData)
                }
                
            } catch (error) {
                console.error('Error loading entry data:', error)
                this.showAlert('Errore nel caricamento dei dati', 'error')
            }
        },
        
        populateForm(entryData) {
            console.log('Populating form with data:', entryData) // Debug
            
            // Popola i dati base del form
            this.formData = {
                account_id: entryData.wallet?.id ? entryData.account_id.toString() : "-1",
                amount: Math.abs(entryData.amount || 0),
                currency_id: entryData.currency_id || 1,
                payment_type: entryData.payment_type?.id || 1,
                date_time: entryData.date_time || this.formData.date_time,
                note: entryData.note || null,
                planning: entryData.planning || 0,
                end_date_time: entryData.end_date_time || null,
                labels: entryData.labels ? entryData.labels.map(label => label.id) : [],
                uuid: entryData.uuid || null,
                transfer_id: entryData.transfer_id || false,
                confirmed: entryData.confirmed !== undefined ? entryData.confirmed : true,
                waranty: entryData.waranty || false,
                geolocalization: entryData.geolocation || "",
                exclude_from_stats: entryData.exclude_from_stats || false
            }
            
            // Se è un modello, popola anche il nome del modello
            if (this.isModel) {
                this.name = entryData.name || ''
            }
            
            // Emetti i dati al componente padre per popolare i campi specifici
            this.$emit('entry-loaded', entryData)
        },

        async loadModelData() {
            if (this.selectedModel && this.selectedModel !== "0") {
                try {
                    const CoreService = (await import('../../services/core.service')).default
                    const apiService = new CoreService()
                    
                    const modelData = await apiService.getModel(this.selectedModel)
                    this.applyModelData(modelData)
                } catch (error) {
                    console.error('Error loading model data:', error)
                    this.showAlert('Errore nel caricamento del modello', 'error')
                }
            }
        },
        
        applyModelData(modelData) {
            // Applica i dati del modello al form
            this.formData.amount = Math.abs(modelData.amount || 0)
            this.formData.currency_id = modelData.currency_id || 1
            this.formData.payment_type = modelData.payment_type?.id || 1
            this.formData.note = modelData.note || null
            this.formData.labels = modelData.labels ? modelData.labels.map(label => label.id) : []
            this.formData.exclude_from_stats = modelData.exclude_from_stats || false
            
            // Emetti i dati al componente padre per popolare i campi specifici
            this.$emit('model-loaded', modelData)
        }
    }
}
</script>
