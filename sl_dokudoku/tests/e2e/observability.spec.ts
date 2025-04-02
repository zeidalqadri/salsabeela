/// <reference types="cypress" />

describe('Observability Tracking', () => {
  beforeEach(() => {
    // Reset any mocked responses before each test
    cy.intercept('POST', '/api/observability', (req) => {
      req.reply({ statusCode: 200 })
    }).as('observabilityApi')
  })

  it('should send TRACE event on successful LLM call', () => {
    const mockLLMResponse = {
      response: 'LLM success',
      model: 'test-model',
      usage: { tokens: 50, prompt_tokens: 20, completion_tokens: 30 }
    }

    cy.intercept('POST', '/api/llm', { body: mockLLMResponse }).as('llmCall')
    cy.visit('/chat')
    
    cy.get('[data-testid="chat-input"]').type('Hello LLM')
    cy.get('[data-testid="send-button"]').click()

    cy.wait('@llmCall')
    cy.wait('@observabilityApi').then((interception) => {
      expect(interception.request.body).to.deep.include({
        type: 'trace',
        data: {
          prompt: 'Hello LLM',
          model: 'test-model',
          tokens: 50,
          success: true
        }
      })
    })
  })

  it('should send ERROR event on API failure', () => {
    const mockError = {
      error: 'Something broke',
      status: 500,
      path: '/api/some-action'
    }

    cy.intercept('POST', '/api/some-action', {
      statusCode: 500,
      body: mockError
    }).as('failingAction')

    cy.visit('/error-test')
    cy.get('[data-testid="trigger-error-button"]').click()

    cy.wait('@failingAction')
    cy.wait('@observabilityApi').then((interception) => {
      expect(interception.request.body).to.deep.include({
        type: 'error',
        data: {
          error: mockError.error,
          status: mockError.status,
          path: mockError.path,
          severity: 'high'
        }
      })
    })
  })

  it('should send PERFORMANCE event after memory search', () => {
    cy.intercept('POST', '/api/memory/search', {
      body: { results: [] }
    }).as('memorySearch')

    cy.visit('/memory-search')
    cy.get('[data-testid="search-input"]').type('performance test')
    cy.get('[data-testid="search-button"]').click()

    cy.wait('@memorySearch')
    cy.wait('@observabilityApi').then((interception) => {
      const perfData = interception.request.body
      expect(perfData.type).to.eq('performance')
      expect(perfData.data).to.have.property('operation', 'Memory Search')
      expect(perfData.data).to.have.property('duration')
      expect(perfData.data.duration).to.be.a('number').and.be.gt(0)
      expect(perfData.data).to.have.property('success', true)
    })
  })

  it('should include metadata in all events', () => {
    cy.intercept('POST', '/api/memory/search', {
      body: { results: [] }
    }).as('memorySearch')

    cy.visit('/memory-search')
    cy.get('[data-testid="search-input"]').type('test')
    cy.get('[data-testid="search-button"]').click()

    cy.wait('@memorySearch')
    cy.wait('@observabilityApi').then((interception) => {
      const eventData = interception.request.body
      // Check common metadata fields
      expect(eventData).to.have.property('timestamp')
      expect(eventData).to.have.property('sessionId')
      expect(eventData).to.have.property('userId')
      expect(eventData).to.have.property('environment')
      expect(eventData.environment).to.be.oneOf(['development', 'staging', 'production'])
    })
  })

  it('should batch multiple events when appropriate', () => {
    // Setup multiple interceptors for a complex operation
    cy.intercept('POST', '/api/memory/search', { body: { results: [] } }).as('search1')
    cy.intercept('POST', '/api/llm', {
      body: { response: 'LLM response', usage: { tokens: 20 } }
    }).as('llm1')

    // Perform multiple operations that should generate events
    cy.visit('/memory-search')
    cy.get('[data-testid="search-input"]').type('batch test')
    cy.get('[data-testid="search-button"]').click()
    cy.get('[data-testid="enhance-button"]').click() // Assuming this triggers LLM

    // Wait for all operations
    cy.wait(['@search1', '@llm1'])

    // Check if events were batched
    cy.wait('@observabilityApi').then((interception) => {
      const events = interception.request.body
      expect(events).to.be.an('array')
      expect(events).to.have.length.of.at.least(2)
      
      // Verify event types
      const eventTypes = events.map(e => e.type)
      expect(eventTypes).to.include('performance')
      expect(eventTypes).to.include('trace')
    })
  })

  it('should handle rate limiting gracefully', () => {
    // Force rate limit by rapid events
    const rapidActions = Array(5).fill(null).map((_, i) => {
      return cy.intercept('POST', `/api/action-${i}`, { body: { success: true } })
        .as(`action${i}`)
    })

    cy.visit('/rate-limit-test')
    
    // Trigger multiple events rapidly
    cy.get('[data-testid="rapid-action-button"]').click()

    // Check if events were queued and sent properly
    cy.wait('@observabilityApi').then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
      // Verify rate limiting headers if your API sends them
      expect(interception.response.headers).to.have.property('x-ratelimit-remaining')
    })
  })

  // Manual Check Reminder: After running tests, manually check Langfuse/observability platform
  // to ensure traces/events appear correctly with expected metadata.
}) 