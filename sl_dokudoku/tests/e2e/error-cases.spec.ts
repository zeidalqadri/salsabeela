/// <reference types="cypress" />

describe('Application Error Handling', () => {
  beforeEach(() => {
    // Reset any custom commands or interceptors
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  // --- Route/Navigation Errors ---
  it('should display a user-friendly 404 page for unknown routes', () => {
    cy.visit('/this/route/does/not/exist', { failOnStatusCode: false })
    cy.get('[data-testid="404-message"]').should('be.visible')
    cy.get('[data-testid="404-message"]').should('contain', 'Page Not Found')
    cy.get('[data-testid="home-link"]').should('be.visible')
  })

  // --- API Errors ---
  it('should handle specific API 500 errors gracefully in UI', () => {
    cy.intercept('GET', '/api/documents', {
      statusCode: 500,
      body: { error: 'Database connection failed' }
    }).as('getDocsFail')

    cy.visit('/documents')
    cy.wait('@getDocsFail')
    
    cy.get('[data-testid="document-list-error"]')
      .should('be.visible')
      .and('contain', 'Could not load documents')
    cy.get('[data-testid="retry-button"]').should('be.visible')
  })

  it('should handle network errors during API calls', () => {
    cy.intercept('GET', '/api/documents', { forceNetworkError: true })
      .as('getDocsNetworkFail')

    cy.visit('/documents')
    cy.wait('@getDocsNetworkFail')
    
    cy.get('[data-testid="document-list-error"]')
      .should('be.visible')
      .and('contain', 'Network error')
    cy.get('[data-testid="offline-indicator"]').should('be.visible')
  })

  // --- Authentication/Authorization Errors ---
  it('should redirect unauthenticated user from protected page to login', () => {
    cy.clearCookies()
    cy.visit('/admin/dashboard')
    
    cy.url().should('include', '/login')
    cy.get('[data-testid="login-form"]').should('be.visible')
    cy.get('[data-testid="login-message"]')
      .should('contain', 'Please log in to access this page')
  })

  it('should show "forbidden" message if authenticated user lacks permissions', () => {
    // Custom command to login as non-admin user
    cy.login('regular_user', 'password')
    cy.visit('/admin/dashboard', { failOnStatusCode: false })
    
    cy.get('[data-testid="forbidden-message"]')
      .should('be.visible')
      .and('contain', 'Access Denied')
    cy.get('[data-testid="contact-support"]').should('be.visible')
  })

  // --- Input Validation Errors ---
  it('should display validation errors for required fields on form submission', () => {
    cy.visit('/document/new')
    
    // Try to submit form without required fields
    cy.get('[data-testid="submit-button"]').click()
    
    // Check for validation messages
    cy.get('[data-testid="title-input-error"]')
      .should('be.visible')
      .and('contain', 'Title is required')
    cy.get('[data-testid="description-input-error"]')
      .should('be.visible')
      .and('contain', 'Description is required')
    
    // Form should not be submitted
    cy.url().should('include', '/document/new')
  })

  it('should display validation errors for invalid input formats', () => {
    cy.visit('/user/profile')
    
    // Test invalid email
    cy.get('[data-testid="email-input"]')
      .clear()
      .type('invalid-email')
    cy.get('[data-testid="save-profile-button"]').click()
    cy.get('[data-testid="email-input-error"]')
      .should('be.visible')
      .and('contain', 'Invalid email format')
    
    // Test invalid phone number
    cy.get('[data-testid="phone-input"]')
      .clear()
      .type('123')
    cy.get('[data-testid="save-profile-button"]').click()
    cy.get('[data-testid="phone-input-error"]')
      .should('be.visible')
      .and('contain', 'Invalid phone number')
  })

  // --- Rate Limiting Errors ---
  it('should handle rate limiting gracefully', () => {
    // Simulate rate limit exceeded
    cy.intercept('POST', '/api/documents', {
      statusCode: 429,
      body: {
        error: 'Too Many Requests',
        retryAfter: 60
      }
    }).as('rateLimitExceeded')

    cy.visit('/documents')
    cy.get('[data-testid="create-doc-button"]').click()
    
    cy.wait('@rateLimitExceeded')
    cy.get('[data-testid="rate-limit-message"]')
      .should('be.visible')
      .and('contain', 'Please try again in 1 minute')
  })

  // --- File Upload Errors ---
  it('should handle file upload errors appropriately', () => {
    cy.visit('/documents/upload')
    
    // Simulate file too large error
    cy.intercept('POST', '/api/upload', {
      statusCode: 413,
      body: {
        error: 'File too large',
        maxSize: '5MB'
      }
    }).as('uploadError')

    // Trigger file upload
    cy.get('[data-testid="file-input"]')
      .attachFile('large-file.pdf')
    
    cy.wait('@uploadError')
    cy.get('[data-testid="upload-error"]')
      .should('be.visible')
      .and('contain', 'File size exceeds 5MB limit')
  })

  // --- Error Recovery ---
  it('should recover gracefully after error resolution', () => {
    let requestCount = 0
    cy.intercept('GET', '/api/documents', (req) => {
      requestCount++
      if (requestCount === 1) {
        req.reply({ statusCode: 500 })
      } else {
        req.reply({ body: { documents: [] } })
      }
    }).as('getDocsRetry')

    cy.visit('/documents')
    cy.wait('@getDocsRetry')
    
    // First attempt fails
    cy.get('[data-testid="document-list-error"]').should('be.visible')
    
    // Retry should succeed
    cy.get('[data-testid="retry-button"]').click()
    cy.wait('@getDocsRetry')
    cy.get('[data-testid="document-list"]').should('be.visible')
    cy.get('[data-testid="document-list-error"]').should('not.exist')
  })

  // --- Concurrent Error Handling ---
  it('should handle multiple simultaneous errors correctly', () => {
    // Setup multiple failing endpoints
    cy.intercept('GET', '/api/documents', { statusCode: 500 }).as('docsFail')
    cy.intercept('GET', '/api/users', { statusCode: 404 }).as('usersFail')
    cy.intercept('GET', '/api/settings', { forceNetworkError: true }).as('settingsFail')

    cy.visit('/dashboard')
    
    // Wait for all requests to fail
    cy.wait(['@docsFail', '@usersFail', '@settingsFail'])
    
    // Check that each error is displayed appropriately
    cy.get('[data-testid="error-summary"]').within(() => {
      cy.get('[data-testid="documents-error"]').should('be.visible')
      cy.get('[data-testid="users-error"]').should('be.visible')
      cy.get('[data-testid="settings-error"]').should('be.visible')
    })
    
    // Verify error boundary hasn't crashed the entire app
    cy.get('[data-testid="navigation"]').should('be.visible')
  })
}) 