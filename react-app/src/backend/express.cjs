const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json());

app.post('/udito/:id', (req, res) => {
    // req.body json: {"nev":"Sprite","liter":1,"bubis-e":true}

    // TODO - if id exists?

    // if id does not exist yet:
    const id = +req.params.id;

    const newFileLine = `${req.params.id};${req.body.nev};${req.body.liter};${req.body["bubis-e"]}`;
    try {
        fs.appendFileSync('uditok.txt', newFileLine + "\n");
    } catch(e) {
        res.status(500).json({fileError: e});
    }

    const responseBody = {id, ...req.body}

    res.status(201).json(responseBody);
});

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'error.html'));
});

const port = 3333;
app.listen(port, () => {
    console.log('Express backend server is running on port', port);
});