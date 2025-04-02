/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to log in a user
     * @example cy.login('username', 'password')
     */
    login(username: string, password: string): void

    /**
     * Custom command to clear auth state
     * @example cy.logout()
     */
    logout(): void

    getByTestId(id: string): Chainable<JQuery<HTMLElement>>
  }
} 