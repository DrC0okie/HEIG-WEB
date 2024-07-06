/// <reference types="cypress" />

before(function () {
  // Add pixels threshold for assertions
  // and ensure padding are not included when calculating elements dimensions and positions
  cy.configureLayoutInspector({
    threshold: 4,
    excludePadding: true,
  });
});

describe('Scroll', function () {
  beforeEach(function () {
    cy.visit('http://localhost:8080/');
  });

  it('should keep player visible even when scrolling', function () {
    const checkPlayerPosition = () => {
      console.log('checkPlayerPosition');
      cy.get('#player')
        .then((elem) => elem[0].getBoundingClientRect().bottom)
        .then((bottom) => {
          assert.equal(
            bottom,
            Cypress.config().viewportHeight,
            'the player should stick to the bottom of the screen',
          );
        });
    };

    checkPlayerPosition();
    // Scroll to last song
    cy.get('main').contains('Billie Eilish').scrollIntoView();
    checkPlayerPosition();
  });
});
