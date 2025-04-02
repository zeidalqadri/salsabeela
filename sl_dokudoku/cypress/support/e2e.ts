/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

import './commands'

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to log in a user
       * @example cy.login('username', 'password')
       */
      login(username: string, password: string): Chainable<Element>
      
      /**
       * Testing Library queryByTestId shortcut
       * @example cy.getByTestId('search-input')
       */
      getByTestId<E extends Node = HTMLElement>(
        id: string,
        options?: Partial<Cypress.Loggable & Cypress.Timeoutable>
      ): Chainable<JQuery<E>>
    }
  }
}

// Initialize Testing Library commands first
import '@testing-library/cypress/add-commands';

// Custom command implementation
Cypress.Commands.add('login', (username: string, password: string) => {
  cy.session([username, password], () => {
    cy.visit('/login')
    
    // Add network monitoring
    cy.intercept('POST', '/api/auth/callback/credentials').as('loginRequest')
    
    // Verify form elements exist before interacting
    cy.getByTestId('username-input').should('be.visible').type(username)
    cy.getByTestId('password-input').should('be.visible').type(password)
    cy.getByTestId('login-button').should('be.visible').click()

    // Wait for login request completion
    cy.wait('@loginRequest').then((interception) => {
      // Log full response for debugging
      cy.log('Login response:', interception.response?.body)
      expect(interception.response?.statusCode).to.be.oneOf([200, 302])
    })

    // Verify session storage
    cy.getCookie('next-auth.session-token').should('exist')
    cy.window().its('localStorage').should('have.property', 'authToken')
  })
})

Cypress.Commands.add('getByTestId', (selector, options = {}) => {
  return cy.get(`[data-testid="${selector}"]`, options)
})

beforeEach(() => {
  cy.window().should('have.property', 'appReady', true);
  cy.task('checkDbConnection');
  
  // Verify auth provider configuration
  cy.task('validateAuthConfig', {
    requiredEnvVars: [
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL',
      'DATABASE_URL'
    ]
  })
  
  // Clear auth state
  cy.clearCookies()
  cy.clearLocalStorage()
  cy.window().then((win) => win.sessionStorage.clear())
})

// Add smoke test
describe('Sanity Check', () => {
  it('should render core UI elements', () => {
    cy.visit('/');
    cy.getByTestId('main-header').should('contain', 'Welcome');
    cy.getByTestId('nav-menu').children().should('have.length.at.least', 3);
  });
});