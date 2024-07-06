/// <reference types="cypress" />

before(function () {
  // Add pixels threshold for assertions
  // and ensure padding are not included when calculating elements dimensions and positions
  cy.configureLayoutInspector({
    threshold: 4,
    excludePadding: true,
  });
});

describe('Playlist info', function () {
  beforeEach(function () {
    cy.visit('http://localhost:8080/');

    cy.get('main').as('main');
    cy.get('main').find('img').as('playlistCover');
    cy.get('main').contains('Playlist').as('type');
    cy.get('main').contains('Hits of the moment').as('playlistTitle');
    cy.get('main').contains('By Fábio - Deezer Pop Editor').as('playlistAuthor');
    cy.get('main').contains('2016 · 60 songs · 162 minutes').as('playlistInfo');
    cy.get('#playlist-info').as('playlistSection');
  });

  it('should render the layout', function () {
    cy.get(this.playlistCover).should('be.width', 250);
    cy.get(this.playlistCover).should('be.inside', 'html', {
      top: 86,
      left: 86,
    });
    cy.get(this.playlistTitle).should('be.rightOf', this.playlistCover, 32);
    cy.get(this.playlistTitle).should('have.css', 'font-family', '"Noto Sans", sans-serif');
    cy.get(this.type).should('be.above', this.playlistTitle, 8);
    cy.get(this.playlistAuthor).should('be.below', this.playlistTitle, 8);
    cy.get(this.playlistInfo).should('be.below', this.playlistAuthor, 0);
    cy.get(this.playlistInfo).should('be.verticallyAligned', this.playlistCover, 'bottom') 
  });

  it('should use the right font', function () {
    cy.get(this.type).should('have.css', 'font-size', '16px');
    cy.get(this.type).should('have.css', 'line-height', '24px');

    cy.get(this.playlistTitle).should('have.css', 'font-size', '48px');
    cy.get(this.playlistTitle).should('have.css', 'line-height', '60px');

    cy.get(this.playlistAuthor).should('have.css', 'font-size', '16px');
    cy.get(this.playlistAuthor).should('have.css', 'line-height', '24px');

    cy.get(this.playlistInfo).should('have.css', 'font-size', '16px');
    cy.get(this.playlistInfo).should('have.css', 'line-height', '24px');
  });
});
