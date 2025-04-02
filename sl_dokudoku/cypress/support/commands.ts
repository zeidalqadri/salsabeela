/// <reference types="cypress" />
import '@testing-library/cypress/add-commands';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom login command
       * @example cy.login('test@example.com', 'password123')
       */
      login(username: string, password: string): Chainable<void>
      
      /**
       * Custom command to clear auth state
       * @example cy.logout()
       */
      logout(): Chainable<void>
      
      /**
       * Testing Library queryByTestId shortcut
       * @example cy.getByTestId('search-input')
       */
      getByTestId<E extends HTMLElement = HTMLElement>(
        id: string,
        options?: Partial<Cypress.Loggable & Cypress.Timeoutable>
      ): Chainable<JQuery<E>>
    }
  }
}

Cypress.Commands.add('logout', () => {
  cy.clearCookies()
  cy.clearLocalStorage()
  cy.window().then((win) => win.sessionStorage.clear())
});

Cypress.Commands.add('getByTestId', (selector, options = {}) => {
  return cy.get(`[data-testid="${selector}"]`, options)
})

Cypress.Commands.add('login', (username, password) => {
  cy.session([username, password], () => {
    // Get CSRF token first
    cy.request('/api/auth/csrf').then(({ body }) => {
      cy.request({
        method: 'POST',
        url: '/api/auth/callback/credentials',
        form: true,
        body: {
          csrfToken: body.csrfToken,
          username,
          password
        }
      }).then((response) => {
        expect(response.status).to.eq(200)
      })
    })
    
    // Verify successful login
    cy.visit('/dashboard')
    cy.getByTestId('user-email').should('contain', username)
  })
})

// Import any additional commands here
// For example:
// import '@testing-library/cypress/add-commands' 