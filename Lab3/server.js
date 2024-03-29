const express = require('express')

const app = express()
const port = 5000

// var { unicornsJSON } = require('./data.js')

var unicornsJSON = []

const { writeFile, readFile } = require('fs')
const util = require('util')
const writeFileAsync = util.promisify(writeFile)
const readFileAsync = util.promisify(readFile)

app.listen(process.env.PORT || port, async () => {
    try {
        unicornsJSON = await readFileAsync('./data.json', 'utf-8')
        if (!unicornsJSON) {
            console.log("Could not read the file");
            return
        }
        unicornsJSON = JSON.parse(unicornsJSON)
        console.log(unicornsJSON);
    } catch (error) {
        console.log(error);
    }
    console.log(`Example app listening on port ${port}`)
})

app.get('/api/v1/unicorns', (req, res) => {
    res.send(unicornsJSON)
})

app.use(express.json())

app.post('/api/v1/unicorn', (req, res) => {
    unicornsJSON.push(req.body)
    console.log(unicornsJSON)

    writeFileAsync('./data.json', JSON.stringify(unicornsJSON), 'utf-8')
        .then(() => { })
        .catch((err) => { console.log(err); })

    res.send('Created a new unicorn!')
})

app.get('/api/v1/unicorn/:id', (req, res) => {
    var found = false;
    for (i = 0; i < unicornsJSON.length; i++) {
        if (unicornsJSON[i]._id == req.params.id) {
            found = true;
            break;
        }
    }
    if (found) { res.json(unicornsJSON[i]); return }
    res.json({ msg: "not found" })
})

app.patch('/api/v1/unicorn/:id', (req, res) => {
    unicornsJSON = unicornsJSON.map(({ _id, ...aUnicorn }) => {
        if (_id == req.body._id) {
            console.log("Bingo!");
            return req.body
        } else
            return aUnicorn
    })
    console.log(unicornsJSON)

    writeFileAsync('./data.json', JSON.stringify(unicornsJSON), 'utf-8')
        .then(() => { })
        .catch((err) => { console.log(err); })

    res.send("Updated successfully!")
})

app.delete('/api/v1/unicorn/:id', (req, res) => {
    unicornsJSON = unicornsJSON.filter((element) => element._id != req.params.id)

    writeFileAsync('./data.json', JSON.stringify(unicornsJSON), 'utf-8')
        .then(() => { })
        .catch((err) => { console.log(err); })

    res.send('Delete a unicorn')
})