const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3001;
const db = require('./db/db.json');
const { v4: uuidv4 } = require('uuid');

//Express Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//API Routes
app.get('/api/notes', (req, res) => {
    res.json(db);
})

app.post('/api/notes', ( req, res) => {
    const id = uuidv4();
    const note = {
        id: id,
        title: req.body.title,
        text: req.body.text
    };
    const result = db;
    result.push(note);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(db, null, 2)
    );

    res.json(note);
});

app.delete('/api/notes/:id', (req, res) => {
    const result = db;
    result.splice(req.params.id, 1);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(db, null, 2)
    );
    res.send(req.params.id);
});

//HTML Routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}...`)
});