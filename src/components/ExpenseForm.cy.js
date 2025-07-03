// Esempio di test per un componente ExpenseForm
describe('ExpenseForm Component', () => {
  it('validates required fields', () => {
    const ExpenseFormComponent = {
      template: `
        <form @submit.prevent="onSubmit">
          <input 
            v-model="form.amount" 
            type="number" 
            placeholder="Amount"
            data-cy="amount-input"
            required
          />
          <input 
            v-model="form.description" 
            type="text" 
            placeholder="Description"
            data-cy="description-input"
            required
          />
          <button type="submit" data-cy="submit-btn">
            Add Expense
          </button>
          <div v-if="errors.length" data-cy="errors">
            <p v-for="error in errors" :key="error">{{ error }}</p>
          </div>
        </form>
      `,
      data() {
        return {
          form: {
            amount: '',
            description: ''
          },
          errors: []
        }
      },
      methods: {
        onSubmit() {
          this.errors = []
          if (!this.form.amount) this.errors.push('Amount is required')
          if (!this.form.description) this.errors.push('Description is required')
          
          if (this.errors.length === 0) {
            this.$emit('expense-added', this.form)
          }
        }
      }
    }

    cy.mount(ExpenseFormComponent)
    
    // Test submit senza dati
    cy.get('[data-cy=submit-btn]').click()
    cy.get('[data-cy=errors]').should('exist')
    
    // Test con dati validi
    cy.get('[data-cy=amount-input]').type('100')
    cy.get('[data-cy=description-input]').type('Grocery shopping')
    cy.get('[data-cy=submit-btn]').click()
    cy.get('[data-cy=errors]').should('not.exist')
  })

  it('formats amount correctly', () => {
    const ExpenseFormComponent = {
      template: `
        <div>
          <input 
            v-model="amount" 
            type="number" 
            step="0.01"
            data-cy="amount-input"
          />
          <span data-cy="formatted-amount">{{ formattedAmount }}</span>
        </div>
      `,
      data() {
        return {
          amount: 0
        }
      },
      computed: {
        formattedAmount() {
          return new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: 'EUR'
          }).format(this.amount)
        }
      }
    }

    cy.mount(ExpenseFormComponent)
    cy.get('[data-cy=amount-input]').type('123.45')
    cy.get('[data-cy=formatted-amount]').should('contain', '€')
  })
})
