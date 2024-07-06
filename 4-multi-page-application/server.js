import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Set up Express to use EJS as the template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Static files
app.use(express.static('public'));

// Configure express to use urlencoded form parsing middleware
app.use(express.urlencoded({ extended: true }));

// Connect to the database
let db;
async function connectToDatabase() {
    db = await open({
        filename: 'dictons.sqlite',
        driver: sqlite3.Database
    });
}

connectToDatabase();

// GET /
// Displays a random dicton in HTML.
// Example: <q>random dicton</q>
app.get('/', async (req, res) => {
    const dicton = await db.get('SELECT dicton FROM dictons ORDER BY RANDOM() LIMIT 1');
    res.render('random_dicton', { dicton: dicton.dicton });
});


// GET /list
// Displays all the dictons ordered by id in HTML
// Example: <ul><li><a href="/1">dicton 1</a></li></ul> 
app.get('/list', async (req, res) => {
    const dictons = await db.all('SELECT * FROM dictons ORDER BY id');
    res.render('list_dictons', { dictons });
});

// GET /create
// Displays a HTML form for creating new dictons with POST requests.
// Example: <form method=POST><input type='text' name='dicton'></input><button>Nouveau dicton</button></form>
app.get('/create', (req, res) => {
    res.render('create_dicton');
});

// POST /create
// Inserts a new dicton in the database and redirect the user to its url
// Example: 301 /list
app.post('/create', async (req, res) => {
    const { dicton } = req.body;
    if (dicton) {
        await db.run('INSERT INTO dictons (dicton) VALUES (?)', dicton);
        res.redirect('/list');
    } else {
        res.redirect('/create');
    }
});

// GET /:id
// Returns a dicton by its id.
app.get('/:id', async (req, res) => {
    const id = req.params.id;
    const dicton = await db.get('SELECT * FROM dictons WHERE id = ?', id);
    if (dicton) {
        res.render('dicton_by_id', { dicton });
    } else {
        res.status(404).send('Dicton not found');
    }
});

export default app;