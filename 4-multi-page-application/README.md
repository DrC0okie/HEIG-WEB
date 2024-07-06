[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/KFkgDVjO)





# Exercise 5

Group members:

- <Timothée Van hove> (<DrC0okie>)

In this assignment, you are asked to implement a multi-page application with Express and SQLite. The goal is to create a small web site for managing french [dictons](https://fr.wiktionary.org/wiki/Annexe:Liste_de_proverbes_fran%C3%A7ais).

The `dictons.sqlite` file contains the SQLite database. It has been added to the gitignore file to prevent unexpected changes.

The pages displayed by the applications are described in the `server.js` file. All your changes should take place in this file. 

You must use a template engine to render the Web pages.

A few unit tests have been included in the `test/tests.js` file to guide you through the assignment and validate your progress.

To complete this assignment, you will probably have to read some documentation and to include some modules. Remember that the simplest and boring solutions are often the best (i.e. You can have fun with an ORM but it is not a requirement). 

## Prerequisites

- Node 16 (LTS)

## Setup

Install project dependencies
```sh
npm install
```

Start the server
```sh
npm run start

# or start server in watch mode
# so it automatically restarts on file changes
npm run watch
```

Run tests
```
npm run test
```