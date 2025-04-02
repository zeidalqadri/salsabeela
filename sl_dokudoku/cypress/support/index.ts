import './commands'

Cypress.on('uncaught:exception', (err) => {
  // Ignore specific errors
  if (err.message.includes('ResizeObserver')) return false
  return true
})

Cypress.on('test:after:run', (test, runnable) => {
  if (test.state === 'failed') {
    const screenshot = `screenshots/${Cypress.spec.name}/${runnable.parent.title} -- ${test.title} (failed).png`
    cy.log(`Screenshot saved at: ${screenshot}`)
  }
}) 