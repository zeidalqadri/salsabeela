/// <reference types="cypress" />

describe('Memory Search', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/memory/search').as('searchRequest')
    cy.visit('/memory-search')
  });

  it('should display and filter search results', () => {
    // Mock API response
    cy.fixture('memory-search-results').then((results) => {
      cy.intercept('POST', '/api/memory/search', {
        body: results
      }).as('searchRequest')
    });

    // Test search flow
    cy.getByTestId('search-input').type('test query{enter}')
      .should('have.value', 'test query');
    
    cy.wait('@searchRequest').then((interception) => {
      expect(interception.request.body).to.have.property('query', 'test query');
    });

    // Verify results
    cy.getByTestId('search-results')
      .should('be.visible')
      .children()
      .should('have.length.at.least', 1);

    // Test threshold filtering
    cy.getByTestId('threshold-slider')
      .invoke('val', 0.8)
      .trigger('change');
    
    cy.getByTestId('search-button').click();
    
    cy.wait('@searchRequest').then((interception) => {
      expect(interception.request.body).to.have.property('threshold', 0.8);
    });
  });

  it('should display search results for valid query', () => {
    const mockResults = [
      { text: 'First result', score: 0.95 },
      { text: 'Second result', score: 0.85 }
    ]
    cy.intercept('POST', '/api/memory/search', { body: { results: mockResults } }).as('searchApi')
    
    cy.get('[data-testid="search-input"]').type('test query')
    cy.get('[data-testid="search-button"]').click()
    
    cy.wait('@searchApi')
    cy.get('[data-testid="search-results"]').should('be.visible')
    cy.get('[data-testid="search-result-item"]').should('have.length', 2)
    cy.get('[data-testid="search-result-item"]').first().should('contain', 'First result')
  });

  it('should show "no results" message for empty results', () => {
    cy.intercept('POST', '/api/memory/search', { body: { results: [] } }).as('emptySearch')
    
    cy.get('[data-testid="search-input"]').type('querythatyieldsnothing')
    cy.get('[data-testid="search-button"]').click()
    
    cy.wait('@emptySearch')
    cy.get('[data-testid="no-results-message"]').should('be.visible')
    cy.get('[data-testid="search-results"]').should('not.exist')
  });

  it('should handle empty query submission', () => {
    cy.get('[data-testid="search-input"]').clear()
    cy.get('[data-testid="search-button"]').click()
    cy.get('[data-testid="input-error"]').should('be.visible')
      .and('contain', 'Please enter a search query')
  });

  it('should handle special characters in query', () => {
    const mockResult = { text: 'Special chars result', score: 0.9 }
    cy.intercept('POST', '/api/memory/search', { body: { results: [mockResult] } }).as('specialCharSearch')
    
    const specialQuery = '!@#$%^&*()_+=-`~[]{}|;:",./<>?'
    cy.get('[data-testid="search-input"]').type(specialQuery, { delay: 0 })
    cy.get('[data-testid="search-button"]').click()
    
    cy.wait('@specialCharSearch')
    cy.get('[data-testid="search-result-item"]').should('contain', 'Special chars result')
  });

  it('should display loading state during search', () => {
    cy.intercept('POST', '/api/memory/search', (req) => {
      req.reply({
        delay: 1000,
        body: { results: [{ text: 'Delayed result', score: 0.8 }] }
      })
    }).as('delayedSearch')
    
    cy.get('[data-testid="search-input"]').type('test query')
    cy.get('[data-testid="search-button"]').click()
    
    cy.get('[data-testid="loading-indicator"]').should('be.visible')
    cy.wait('@delayedSearch')
    cy.get('[data-testid="loading-indicator"]').should('not.exist')
    cy.get('[data-testid="search-results"]').should('be.visible')
  });

  it('should display error message on API failure', () => {
    cy.intercept('POST', '/api/memory/search', {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    }).as('failedSearch')
    
    cy.get('[data-testid="search-input"]').type('test query')
    cy.get('[data-testid="search-button"]').click()
    
    cy.wait('@failedSearch')
    cy.get('[data-testid="error-message"]')
      .should('be.visible')
      .and('contain', 'Failed to perform search')
  });

  it('should apply relevance threshold filter', () => {
    const mockResults = [
      { text: 'High score', score: 0.9 },
      { text: 'Low score', score: 0.3 }
    ]
    cy.intercept('POST', '/api/memory/search', { body: { results: mockResults } }).as('thresholdSearch')
    
    cy.get('[data-testid="threshold-slider"]').invoke('val', 0.5).trigger('change')
    cy.get('[data-testid="search-input"]').type('test query')
    cy.get('[data-testid="search-button"]').click()
    
    cy.wait('@thresholdSearch')
    cy.get('[data-testid="search-result-item"]').should('have.length', 1)
    cy.get('[data-testid="search-result-item"]').should('contain', 'High score')
  });

  it('should handle pagination of results', () => {
    const page1Results = Array.from({ length: 10 }, (_, i) => ({
      text: `Result ${i + 1}`,
      score: 0.9
    }))
    const page2Results = Array.from({ length: 5 }, (_, i) => ({
      text: `Result ${i + 11}`,
      score: 0.8
    }))
    
    cy.intercept('POST', '/api/memory/search?page=1', {
      body: { results: page1Results, hasMore: true }
    }).as('page1Search')
    cy.intercept('POST', '/api/memory/search?page=2', {
      body: { results: page2Results, hasMore: false }
    }).as('page2Search')
    
    cy.get('[data-testid="search-input"]').type('test query')
    cy.get('[data-testid="search-button"]').click()
    
    cy.wait('@page1Search')
    cy.get('[data-testid="search-result-item"]').should('have.length', 10)
    
    cy.get('[data-testid="load-more-button"]').click()
    cy.wait('@page2Search')
    cy.get('[data-testid="search-result-item"]').should('have.length', 15)
    cy.get('[data-testid="load-more-button"]').should('not.exist')
  });

  // Add tests for pagination if implemented
  // Add tests for UI filters (relevance threshold, date range etc.) if implemented
}); 