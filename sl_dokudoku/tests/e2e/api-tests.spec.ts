/// <reference types="cypress" />

// Use 'chai' assertions which Cypress bundles
// and understands via expect(...)
// No direct import needed if using Cypress globals

describe('API Endpoints', () => {
  it('should handle memory search API correctly', () => {
    cy.request({
      method: 'POST',
      url: '/api/memory/search',
      body: {
        query: 'test query',
        userId: 'test-user'
      },
      failOnStatusCode: false
    }).then((response: Cypress.Response<any>) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('results');
    });
  });

  it('should handle error in memory search API', () => {
    cy.request({
      method: 'POST',
      url: '/api/memory/search',
      body: {
        // Missing required parameters should ideally cause a 400 or specific error
      },
      failOnStatusCode: false
    }).then((response: Cypress.Response<any>) => {
      // Assuming missing params cause a 400 Bad Request
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('error');
    });
  });

  it('should track observability data', () => {
    cy.request({
      method: 'POST',
      url: '/api/observability',
      body: {
        type: 'trace',
        data: {
          prompt: 'test prompt',
          response: { model: 'test-model', usage: { tokens: 100 } },
          metadata: { userId: 'test-user' }
        }
      },
      failOnStatusCode: false
    }).then((response: Cypress.Response<any>) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('success', true);
    });
  });

  it('should handle database connection pool correctly', () => {
    // This test will verify the connection pool is working
    // by making multiple concurrent requests
    // Ensure the health check endpoint exists
    const requests = Array(5).fill(0).map(() =>
      cy.request('/api/health/db-connection')
    );
    
    Promise.all(requests).then(responses => {
      responses.forEach((response: Cypress.Response<any>) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('connected', true);
      });
    });
  });
}); 