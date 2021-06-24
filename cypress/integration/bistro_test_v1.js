// bistro_test_v1.js created with Cypress
//
// Assignment: Create a single E2E test for the English version of Bistro.sk - https://www.bistro.sk/en.
// The script should follow a path that your first-time, unregistered user would likely take.
// - Pick one of the food groups (i.e. pizza, vegan, sushi)
// - Pick any restaurant
// - Add at least 3 items to the cart
// - Go through with filling in the contact information, but do NOT go through with the order :) Feel free to use fake information.

/// <reference types="cypress" />


context('Actions', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  const firstName = 'Prvémeno'
  const lastName = 'Priezvisko'
  const phone = '0912 345 678'
  const email = 'not.a.real.email@definitely.not'
  const addrDesc = 'Prosím nechať pred prvými dverami pri vstupe do Prezidentského paláca :D'

  it('bistro.sk order', () => {
    // accept cookies
    cy.get('div.cookie-usage').contains('OK').click()
      .should('not.exist')

    // fill in our address, waiting for autocomplete response
    cy.intercept('/autocomplete*').as('getAddresses')
    cy.get('input#hp-autocomplete').type('Hodzovo namestie 1')
    cy.wait('@getAddresses')
    cy.get('input#hp-autocomplete').type('{enter}')

    // select Pizza from cuisines, check if it is really selected
    cy.get('.cuisines').contains('Pizza').click()
    cy.get('.cuisines > .active').should('contain', 'Pizza')

    // open first restaurant's menu
    cy.get('.button.open').first().click()

    // from Pizza section select first three pizzas
    cy.contains('.title', 'Pizza').scrollIntoView()
      .parent().parent().next().as('pizzaSection')
    addItem(0)
    addItem(1)
    addItem(2)

    // fill out order information
    cy.get('#cartOrderButton').click()
    cy.contains('Without login').click()
    cy.get('input#firstname').type(firstName).should('have.value', firstName)
    cy.get('input#lastname').type(lastName).should('have.value', lastName)
    cy.get('input#phone').type(phone).should('have.value', phone)
    cy.get('input#email').type(email).should('have.value', email)
    cy.get('textarea[name="location[other]"]').type(addrDesc).should('have.value', addrDesc)
    cy.get('input#accepted').should('not.be.checked').click().should('be.checked')
    cy.get('input#ageRestrict').should('not.be.checked').click().should('be.checked')
  })
})

// add nth food from pizzaSection to cart
// if offered to pick add-ons, confirm without any
function addItem(nth) {
  cy.get('@pizzaSection').find('.addToCart').eq(nth).click()
  cy.get('body').then(($body) => {
    if ($body.find('.attributes').length > 0) {
      cy.get('.modal-bottom a').click()
    } else {
      return
    }
  })
}