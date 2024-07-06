import assert from 'assert';
import puppeteer from 'puppeteer';
import app from '../server.js';

let browser;
let server;

describe('The web application', () => {
  before(done => {
    server = app.listen(3000, done);
  });

  after(async () => {
    await server.close();
  });

  beforeEach(async () => {
    browser = await puppeteer.launch({ headless: true });
  });

  afterEach(async () => {
    await browser.close();
  });

  it('should display a random dicton', async () => {
    let page = await browser.newPage();
    let previousContent = "";
    for (let i = 0; i < 10; i++) {
        await page.goto("http://localhost:3000/");
        let content = await page.content();
        assert.ok(content.includes("<q>"));
        assert.ok(content.includes("</q>"));
        assert.notEqual(previousContent, content)
        previousContent = content;
    }
  }).timeout(10000);

  it('should display a list of dictons', async () => {
    let page = await browser.newPage();
    await page.goto("http://localhost:3000/list");
    let content = await page.content();
    assert.ok(content.includes("<ul>"));
    assert.ok(content.includes("</ul>"));
    let count = (await page.$$('li')).length;
    assert.ok(count > 50);
  }).timeout(10000);

  it('should display a form creating new dictons', async () => {
    let page = await browser.newPage();
    await page.goto("http://localhost:3000/create");
    let content = await page.content();
    assert.ok(content.includes("form"));
    assert.ok(content.includes("input"));
    assert.ok(content.includes("method"));
    assert.ok(content.includes("POST"));
    assert.ok(content.includes("type"));
    assert.ok(content.includes("text"));
    assert.ok(content.includes("name"));
    assert.ok(content.includes("button"));
  }).timeout(10000);

  it('should create a new dictons when the form is submitted', async () => {
    let page = await browser.newPage();
    await page.goto("http://localhost:3000/list");  
    let countBefore = (await page.$$('li')).length;
    await page.goto("http://localhost:3000/create");
    await page.type('input[name="dicton"]', 'New dicton test');
    await page.click("button");
    await page.goto("http://localhost:3000/list");  
    let countAfter = (await page.$$('li')).length;
    assert.equal(countBefore + 1, countAfter);
  }).timeout(10000);

  it('should display dictons by id', async () => {
    let page = await browser.newPage();
    await page.goto("http://localhost:3000/1");  
    let content = await page.content();
    assert.ok(content.includes("il n’est pire sourd que celui qui ne veut pas entendre"));
    await page.goto("http://localhost:3000/2");  
    content = await page.content();
    assert.ok(content.includes("si l’on y regarde de près il n’y a que l’épaisseur d’un sabot"));
    await page.goto("http://localhost:3000/10");  
    content = await page.content();
    assert.ok(content.includes("enfant brûlé a peur du feu"));
  }).timeout(10000);

});