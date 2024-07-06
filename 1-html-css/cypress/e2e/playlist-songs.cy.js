/// <reference types="cypress" />

before(function () {
  // Add pixels threshold for assertions
  // and ensure padding are not included when calculating elements dimensions and positions
  cy.configureLayoutInspector({
    threshold: 4,
    excludePadding: true,
  });
});

describe('Playlist songs', function () {
  beforeEach(function () {
    cy.visit('http://localhost:8080/');

    cy.get('main').as('main');

    // song list
    cy.get('main').contains('Stay').as('track1');
    cy.get('main').contains('The Kid Laroi').as('artist1');

    cy.get('main').contains('INDUSTRY BABY').as('track2');
    cy.get('main').contains('Lil Nas X').as('artist2');

    cy.get('main').contains('Woman').as('track3');
    cy.get('main').contains('Doja Cat').as('artist3');

    cy.get('main').contains('Bad Habits').as('track4');
    cy.get('main').contains('Ed Sheeran').as('artist4');

    cy.get('main').contains('Way 2 Sexy').as('track5');
    cy.get('main').contains('Drake').as('artist5');

    cy.get('main').contains('Pepas').as('track5');
    cy.get('main').contains('Farruko').as('artist5');

    cy.get('main').contains('Take My Breath').as('track6');
    cy.get('main').contains('The Weeknd').as('artist6');

    cy.get('main').contains('Happier Than Ever').as('track7');
    cy.get('main').contains('Billie Eilish').as('artist7');
  });

  it('should render layout', function () {
    cy.get(this.track1).should('be.above', this.artist1, 4);
    cy.get(this.artist1).should('be.above', this.track2, 32);

    cy.get(this.track2).should('be.above', this.artist2, 4);
    cy.get(this.artist2).should('be.above', this.track3, 32);

    cy.get(this.track3).should('be.above', this.artist3, 4);
    cy.get(this.artist3).should('be.above', this.track4, 32);

    cy.get(this.track5).should('be.above', this.artist5, 4);
    cy.get(this.artist5).should('be.above', this.track6, 32);

    cy.get(this.track6).should('be.above', this.artist6, 4);
    cy.get(this.artist6).should('be.above', this.track7, 32);

    cy.get(this.track7).should('be.above', this.artist7, 4);

    cy.get(this.track1).should('be.inside', 'html', { left: 102 });
    cy.get(this.track2).should('be.inside', 'html', { left: 102 });
    cy.get(this.track3).should('be.inside', 'html', { left: 102 });
    cy.get(this.track4).should('be.inside', 'html', { left: 102 });
    cy.get(this.track5).should('be.inside', 'html', { left: 102 });
    cy.get(this.track6).should('be.inside', 'html', { left: 102 });
    cy.get(this.track7).should('be.inside', 'html', { left: 102 });
  });

  it('should use the right font', function () {
    cy.get(this.track1).should('have.css', 'font-size', '16px');
    cy.get(this.track1).should('have.css', 'line-height', '24px');
    cy.get(this.track1).should('have.css', 'font-weight', '700');

    cy.get(this.track2).should('have.css', 'font-size', '16px');
    cy.get(this.track2).should('have.css', 'line-height', '24px');
    cy.get(this.track2).should('have.css', 'font-weight', '700');

    cy.get(this.track3).should('have.css', 'font-size', '16px');
    cy.get(this.track3).should('have.css', 'line-height', '24px');
    cy.get(this.track3).should('have.css', 'font-weight', '700');

    cy.get(this.track4).should('have.css', 'font-size', '16px');
    cy.get(this.track4).should('have.css', 'line-height', '24px');
    cy.get(this.track4).should('have.css', 'font-weight', '700');

    cy.get(this.track5).should('have.css', 'font-size', '16px');
    cy.get(this.track5).should('have.css', 'line-height', '24px');
    cy.get(this.track5).should('have.css', 'font-weight', '700');

    cy.get(this.track6).should('have.css', 'font-size', '16px');
    cy.get(this.track6).should('have.css', 'line-height', '24px');
    cy.get(this.track6).should('have.css', 'font-weight', '700');

    cy.get(this.artist1).should('have.css', 'font-size', '16px');
    cy.get(this.artist1).should('have.css', 'line-height', '24px');

    cy.get(this.artist2).should('have.css', 'font-size', '16px');
    cy.get(this.artist2).should('have.css', 'line-height', '24px');

    cy.get(this.artist3).should('have.css', 'font-size', '16px');
    cy.get(this.artist3).should('have.css', 'line-height', '24px');

    cy.get(this.artist4).should('have.css', 'font-size', '16px');
    cy.get(this.artist4).should('have.css', 'line-height', '24px');

    cy.get(this.artist5).should('have.css', 'font-size', '16px');
    cy.get(this.artist5).should('have.css', 'line-height', '24px');

    cy.get(this.artist6).should('have.css', 'font-size', '16px');
    cy.get(this.artist6).should('have.css', 'line-height', '24px');
  });
});
