/// <reference types="cypress" />

before(function () {
  // Add pixels threshold for assertions
  // and ensure padding are not included when calculating elements dimensions and positions
  cy.configureLayoutInspector({
    threshold: 4,
    excludePadding: true,
  });
});

describe('Player', function () {
  beforeEach(function () {
    cy.visit('http://localhost:8080/');

    cy.get('#player').as('player');
    cy.get('#player').find('img[alt="Stay"]').as('trackImage');
    cy.get('#player').contains('STAY').as('trackTitle');
    cy.get('#player').contains('The Kid Laroi').as('trackAuthor');

    cy.get('#player').find('img[alt="Skip Previous"]').as('previousIcon');
    cy.get('#player').find('img[alt="Pause"]').as('pauseIcon');
    cy.get('#player').find('img[alt="Skip Next"]').as('nextIcon');

    cy.get('#player').contains('Powered by').as('poweredBy');
    cy.get('#player').find('img[alt="Deezer logo"]').as('deezerLogo');
  });

  it('should render the layout', function () {
    cy.get(this.trackImage).should('height.be.within', 75, 85);
    cy.get(this.trackImage).should('width.be.within', 75, 85);
    cy.get(this.trackImage).should('be.inside', this.player, {
      top: 1,
      bottom: 0,
      left: 0,
    });
    cy.get(this.trackTitle).should('be.rightOf', this.trackImage, 16);
    cy.get(this.trackAuthor).should('be.rightOf', this.trackImage, 16);
    cy.get(this.trackTitle).should('be.above', this.trackAuthor, 0);

    cy.get(this.pauseIcon).should('be.verticallyAligned', this.player, 'centered');
    cy.get(this.pauseIcon).should('be.horizontallyAligned', this.player, 'centered');
    cy.get(this.pauseIcon).should('width.be.within', 38, 42);
    cy.get(this.previousIcon).should('width.be.within', 38, 42);
    cy.get(this.nextIcon).should('width.be.within', 38, 42);
    cy.get(this.pauseIcon).should('be.rightOf', this.previousIcon, 32);
    cy.get(this.pauseIcon).should('be.leftOf', this.nextIcon, 32);

    cy.get(this.deezerLogo).should('be.inside', this.player, { right: 16 });
    cy.get(this.deezerLogo).should('height.be.within', 25, 35);
    cy.get(this.poweredBy).should('be.above', this.deezerLogo);
  });

  it('should use the right font', function () {
    cy.get(this.trackTitle).should('have.css', 'font-size', '14px');
    cy.get(this.trackTitle).should('have.css', 'line-height', '21px');
    cy.get(this.trackTitle).should('have.css', 'font-weight', '700');

    // Accepting two different values (body 1 or body 2) because of an error in the mockup
    cy.get(this.trackAuthor).should('have.css', 'font-size').and('be.oneOf', ['16px', '14px'])
    cy.get(this.trackAuthor).should('have.css', 'line-height').and('be.oneOf', ['21px', '24px'])

    cy.get(this.poweredBy).should('have.css', 'font-size', '12px');
    cy.get(this.poweredBy).should('have.css', 'line-height', '18px');
  });
});
