describe('Authentication Flow', () => {
  const testCredentials = {
    username: 'test@example.com',
    password: 'TestPassword123!'
  }

  before(() => {
    // Seed test user
    cy.exec('pnpm prisma db seed')
  })

  it('should login with valid credentials', () => {
    cy.login(testCredentials.username, testCredentials.password)
    cy.visit('/dashboard')
    cy.getByTestId('user-email').should('contain', testCredentials.username)
  })

  it('should handle invalid credentials', () => {
    cy.login('invalid@example.com', 'wrong', { failOnStatusCode: false })
    cy.getByTestId('login-error')
      .should('be.visible')
      .and('contain', 'Invalid credentials')
  })
}) 