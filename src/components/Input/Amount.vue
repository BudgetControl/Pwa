<template>
    <div class="w-full">
        <label v-if="label" class="block uppercase text-slate-600 text-xs font-bold mb-2">
            {{ label }}
        </label>
        <input :value="displayValue"
            type="number"
            @input="handleInput"
            @blur="handleBlur"
            @focus="handleFocus"
            class="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            :placeholder="placeholder" 
            :class="{ 'border-red-300 bg-red-50': hasError }" />
        <span v-if="hasError" class="text-red-500 text-xs mt-1">{{ errorMessage }}</span>
    </div>
</template>

<script>
export default {
    props: {
        modelValue: {
            type: [Number, String],
            default: null
        },
        placeholder: {
            type: String,
            default: ''
        },
        label: {
            type: String,
            default: null
        },
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            displayValue: '',
            hasError: false,
            errorMessage: '',
            isFocused: false
        };
    },
    emits: ['update:modelValue'],
    watch: {
        modelValue: {
            immediate: true,
            handler(newValue) {
                if (newValue !== null && newValue !== undefined && newValue !== '') {
                    this.displayValue = this.formatForDisplay(newValue)
                } else {
                    this.displayValue = ''
                }
            }
        }
    },
    methods: {
        handleInput(event) {
            let value = event.target.value
            
            // Rimuovi tutti i caratteri non numerici eccetto punto e virgola
            value = value.replace(/[^0-9.,]/g, '')
            
            // Sostituisci la virgola con il punto
            value = value.replace(',', '.')
            
            // Permetti solo un punto decimale
            const parts = value.split('.')
            if (parts.length > 2) {
                value = parts[0] + '.' + parts.slice(1).join('')
            }
            
            // Limita a 2 decimali
            if (parts.length === 2 && parts[1].length > 2) {
                value = parts[0] + '.' + parts[1].substring(0, 2)
            }
            
            this.displayValue = value
            this.validateAndEmit(value)
        },
        
        handleBlur() {
            this.isFocused = false
            if (this.displayValue && this.displayValue !== '') {
                const formatted = this.formatAmount(this.displayValue)
                this.displayValue = formatted
                this.validateAndEmit(formatted)
            }
        },
        
        handleFocus() {
            this.isFocused = true
            this.hasError = false
        },
        
        formatAmount(value) {
            if (!value || value === '') return ''
            
            // Converti in numero
            const numValue = parseFloat(value)
            
            if (isNaN(numValue)) return ''
            
            // Formatta con 2 decimali se necessario
            return numValue.toFixed(2)
        },
        
        formatForDisplay(value) {
            if (!value || value === '') return ''
            
            const numValue = parseFloat(value)
            if (isNaN(numValue)) return ''
            
            // Se l'utente sta digitando, mostra il valore grezzo
            if (this.isFocused) {
                return value.toString()
            }
            
            // Altrimenti formatta con 2 decimali
            return numValue.toFixed(2)
        },
        
        validateAndEmit(value) {
            this.hasError = false
            this.errorMessage = ''
            
            if (!value || value === '') {
                this.$emit('update:modelValue', null)
                return
            }
            
            const numValue = parseFloat(value)
            
            // Validazione: deve essere un numero valido
            if (isNaN(numValue)) {
                this.hasError = true
                this.errorMessage = 'Inserisci un importo valido'
                return
            }
            
            // Validazione: deve essere >= min
            if (numValue < this.min) {
                this.hasError = true
                this.errorMessage = `L'importo deve essere almeno ${this.min}`
                return
            }
            
            // Validazione: deve essere <= max (se specificato)
            if (this.max !== null && numValue > this.max) {
                this.hasError = true
                this.errorMessage = `L'importo non può superare ${this.max}`
                return
            }
            
            // Emetti il valore numerico
            this.$emit('update:modelValue', numValue)
        }
    }
};
</script>

<style scoped>
input.border-red-300 {
    border-color: #fca5a5 !important;
}
</style>