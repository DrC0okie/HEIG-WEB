import express from 'express';
import { port } from './src/constants.js';

const app = express();

// Serve the public directory
app.use(express.static('public'));

// Serve the src directory
app.use('/src', express.static('src'));

app.listen(port);

console.log("App started.");
