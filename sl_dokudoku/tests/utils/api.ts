export const mockSearchResponse = (results: unknown[]) => {
  cy.intercept('POST', '/api/memory/search', {
    statusCode: 200,
    body: { results }
  }).as('searchRequest')
}

export const mockErrorResponse = (path: string, status = 500) => {
  cy.intercept(path, {
    statusCode: status,
    body: { error: 'Test error' }
  }).as(`${path}-error`)
} 