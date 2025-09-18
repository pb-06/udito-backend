const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json());

const uditoDataRead = function (data) {
    // OK
    console.log('GET data', data); // <Buffer 31 3b 53 70 72 69 74 65 3b 31 3b 74 72 75 65 0a 32 3b 53 70 72 69 74 65 3b 31 3b 74 72 75 65 0a 33 3b 53 70 72 69 74 65 3b 31 3b 74 72 75 65 0a>

    const lines = data.toString().split("\n");
    console.log('lines', lines); // lines [ '1;Sprite;1;true', '2;Sprite;1;true', '3;Sprite;1;true', '' ]

    const responseBodyArr = lines.map(line => {
        // TODO - find;
        if (line.length >= 1) {
            const elements = line.split(';');
            return {
                id: +elements[0],
                nev: elements[1],
                liter: +elements[2],
                "bubis-e": elements[3].trim() == 'true'
            }
        } else return undefined
    });
    if (!responseBodyArr[responseBodyArr.length - 1]) {
        responseBodyArr.pop();
    }

    console.log('responseBodyArr', responseBodyArr);

    return responseBodyArr;
}

app.get('/uditok', (req, res) => {
    fs.readFile('uditok.txt', (err, data) => {
        if (err) {
            res.status(404).json({ fileError: err });
        }
        else {
            if (data) {
                const responseBodyArr = uditoDataRead(data);

                res.status(200).json(responseBodyArr);
            }
            else {
                res.status(404).json({ fileError: data });
            }
        }
    });
});

app.get('/udito/:id', (req, res) => {
    fs.readFile('uditok.txt', (err, data) => {
        if (err) {
            res.status(404).json({ fileError: err });
        }
        else {
            if (data) {
                const responseBodyArr = uditoDataRead(data);

                const id = +req.params.id;

                res.status(200).json(responseBodyArr[id - 1]);
            }
            else {
                res.status(404).json({ fileError: data });
            }
        }
    });
});

app.post('/udito/:id', (req, res) => {
    // req.body json: {"nev":"Sprite","liter":1,"bubis-e":true}

    // if id exists?
    let existingId;
    fs.readFile('uditok.txt', (err, data) => {
        // TODO - make readFile() sync
        if (err) {
            res.status(404).json({ fileError: err });
        }
        else {
            if (data) {
                const responseBodyArr = uditoDataRead(data);

                const id = +req.params.id;

                const foundIndex = responseBodyArr.findIndex(udito => +udito.id == +id);
                console.log('foundIndex', foundIndex);

                if (foundIndex >= 0) {
                    existingId = id;
                    //res.status(300).json({ error: "existing id conflict" }); // kliens oldali hiba, a kliens adott meg rossz ID-t
                }
            }
            //else {
            //    res.status(404).json({ fileError: data }); // This is not a bug, but a feature!
            //}
        }
    });

    // if id does not exist yet:
    const id = +req.params.id;

    const newFileLine = `${req.params.id};${req.body.nev};${req.body.liter};${req.body["bubis-e"]}`;
    try {
        fs.appendFileSync('uditok.txt', newFileLine + "\n");
    } catch (e) {
        res.status(500).json({ fileError: e });
    }

    const responseBody = { id, ...req.body };

    console.log('existingId', existingId);

    res.status(201).json(responseBody);
});

app.patch('/udito/:id', (req, res) => {
    const data = fs.readFileSync('uditok.txt');
    const responseBodyArr = uditoDataRead(data);
    console.log('responseBodyArr before', responseBodyArr);
    console.log('params', req.params);
    const id = +req.params.id;
    console.log('id', id);

    const foundIndex = responseBodyArr.findIndex(udito => +udito.id == +id);
    console.log('foundIndex', foundIndex);
    if (foundIndex < 0) {
        res.status(400).json({ error: 'id not found' });
    } else {
        console.log('req.body', req.body);
        const responseBody = { id, ...req.body };
        console.log('responseBody', responseBody);

        responseBodyArr.splice(foundIndex, 1, responseBody);
        console.log('responseBodyArr after splice', responseBodyArr);
        /*
        const newFileLine = `${req.params.id};${req.body.nev};${req.body.liter};${req.body["bubis-e"]}`;
        try {
            fs.appendFileSync('uditok.txt', newFileLine + "\n");
        } catch (e) {
            res.status(500).json({ fileError: e });
        }
        */

        let fileLines = "";
        responseBodyArr.forEach(udito => {
            const newFileLine = `${udito.id};${udito.nev};${udito.liter};${udito["bubis-e"]}\n`;
            fileLines += newFileLine;
        });
        //console.log('fileLines', fileLines);

        fs.writeFileSync('uditok.txt', fileLines);
        
    }

    // TODO - respond actual
    res.status(200).json(responseBodyArr);
})

app.delete('/udito/:id', (req, res) => {
    console.log('params', req.params);
    // req.body json: {"nev":"Sprite","liter":1,"bubis-e":true}

    // if id exists?
    let existingId;
    fs.readFile('uditok.txt', (err, data) => {
        // TODO - make readFile() sync
        if (err) {
            res.status(404).json({ fileError: err });
        }
        else {
            if (data) {
                const responseBodyArr = uditoDataRead(data);

                console.log('params', req.params);
                const id = +req.params?.id;

                const foundIndex = responseBodyArr.findIndex(udito => +udito.id == +id);
                console.log('foundIndex', foundIndex);

                if (foundIndex >= 0) {
                    existingId = id;
                    //res.status(300).json({ error: "existing id conflict" }); // kliens oldali hiba, a kliens adott meg rossz ID-t
                }
            }
            //else {
            //    res.status(404).json({ fileError: data }); // This is not a bug, but a feature!
            //}
        }
    });

    // if id does not exist yet:
    const id = +req.params.id;

    const deletableFileLine = `${req.params?.id};${req.body.nev};${req.body.liter};${req.body["bubis-e"]}`;
    try {
        // TODO - delete id line!
        console.log('id, data', id, data);
        fs.writeFileSync('udito.txt', data);
    } catch (e) {
        res.status(500).json({ fileError: e });
    }

    const responseBody = { id, ...req.body };

    console.log('existingId', existingId);

    res.status(201).json(responseBody);
})

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'error.html'));
});

const port = 3333;
app.listen(port, () => {
    console.log('Express backend server is running on port', port);
});