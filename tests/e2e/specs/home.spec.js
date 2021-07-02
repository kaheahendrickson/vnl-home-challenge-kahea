const data = require('../../fixtures/minimal.json')

describe('Challenge Spec', () => {

  beforeEach(() => {
    cy.intercept('https://*', data)
  })

  it('can select attribute and click to show org', () => {
    cy.visit('/')
    cy.get('#org-table-attribute-1-select').select('violet')

    cy.get('#org-table tbody tr')
      .first()
      .click()

    cy.get('#org-full-name')
      .contains('Sauer, Ruecker and Mann')

    cy.get('#org-respondent')
      .contains('Olga Larson')

    cy.get('#org-address')
      .contains('1643 Senger Vista Asialand 95095')

    cy.get('#org-attribute-1')
      .contains('violet')

    cy.get('#org-attribute-2')
      .contains('501724982')

    cy.get('#org-survey')
      .contains('Corrupti eos pariatur rerum aut ea quaerat consectetur et voluptates.')

    cy.get('#org-question')
      .contains('Similique quaerat autem labore pariatur et adipisci et.')

    cy.get('.modal-footer .btn')
      .click()
  })

  it('has questions', () => {
    cy.visit('/')

    cy.get('#questions-table tbody tr:first td:first')
      .contains('1')

    cy.get('#questions-table tbody tr:first td:last')
      .contains('2')
  })
})
