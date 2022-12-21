const express = require('express')
const mongoose = require('mongoose')
const bodyparser = require("body-parser");
const app = express()
const port = 5000

app.listen(process.env.PORT || 5000, async () => {
    try {
        await mongoose.connect("mongodb+srv://hyunbae:BK2FeIG9GpvBFiTj@cluster0.cnjwrfq.mongodb.net/lab4?retryWrites=true&w=majority")
    } catch (error) {
        console.log('db error');
    }
    console.log(`Example app listening on port ${port}`)
})

const { Schema } = mongoose;

const unicornSchema = new Schema({
    "name": String,
    "weight": Number,
    "loves": [String],
    "gender": {
        enum: ["f", "m"]
    },
    "vampires": Number,
    "dob": Date
})

const unicornModel = mongoose.model('unicorns', unicornSchema);

app.use(bodyparser.urlencoded({
    extended: true
}));

app.get('/api/v2/unicorns', (req, res) => {
    unicornModel.find({})
        .then(docs => {
            console.log(docs)
            res.json(docs)
        })
        .catch(err => {
            console.log(err)
            res.json({ msg: "db reading .. err.  Check with server devs" })
        })
})

app.get('/api/v2/unicorn/:id', (req, res) => {
    console.log(req.params.id);
    unicornModel.find({ _id: mongoose.Types.ObjectId(`${req.params.id}`) })
        .then(doc => {
            console.log(doc)
            res.json(doc)
        })
        .catch(err => {
            console.error(err)
            res.json({ msg: "db reading .. err.  Check with server devs" })
        })
})

app.use(express.json())
app.post('/api/v2/unicorn', (req, res) => {
    unicornModel.create(req.body, function (err) {
        if (err) console.log(err);
    })
    res.json(req.body)
})

app.patch('/api/v2/unicorn/:id', (req, res) => {
    const { _id, ...rest } = req.body;
    unicornModel.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, { $set: { ...rest } }, { runValidators: true }, function (err, res) {
        if (err) console.log(err)
        console.log(res)
    });

    res.send("Updated successfully!")
})

app.delete('/api/v2/unicorn/:id', (req, res) => {
    unicornModel.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }, function (err, result) {
        if (err) console.log(err);
        console.log(result);
    });
    res.send("Deleted successfully?")
})

// const m1 = (req, res, next) => {
//     console.log("1")
//     next()
// }

// const m3 = (req, res, next) => {
//     next()
//     console.log("3")
// }

function errH(err, req, res, next) {
    console.log("err")
    res.send("err")
}


app.get('/api/v2/unicornTest', async (req, res, next) => {
    throw new Error("broken")
})

app.use(errH)