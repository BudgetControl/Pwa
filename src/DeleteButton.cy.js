import DeleteButton from './components/Auth/DeleteButton.vue'

describe('<DeleteButton />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(DeleteButton)
  })
})