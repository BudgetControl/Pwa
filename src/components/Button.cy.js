// Esempio di test per un componente Button
describe('Button Component', () => {
  it('renders with default props', () => {
    const ButtonComponent = {
      template: `
        <button class="btn btn-primary" @click="$emit('click')">
          {{ text }}
        </button>
      `,
      props: {
        text: {
          type: String,
          default: 'Click me'
        }
      }
    }

    cy.mount(ButtonComponent)
    cy.get('button').should('contain', 'Click me')
    cy.get('button').should('have.class', 'btn')
  })

  it('emits click event when clicked', () => {
    const ButtonComponent = {
      template: `
        <button @click="$emit('click', 'test-data')">
          Click me
        </button>
      `
    }

    const onClickSpy = cy.spy().as('onClickSpy')
    
    cy.mount(ButtonComponent, {
      props: {
        onClick: onClickSpy
      }
    })
    
    cy.get('button').click()
    cy.get('@onClickSpy').should('have.been.called')
  })
})
