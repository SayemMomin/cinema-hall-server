const express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y8hyt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()
app.use(bodyParser.json())
app.use(cors())
const port = 20000

app.get('/', (req, res) => {
  res.send('Welcome Cinema Hall!')
})

client.connect(err => {
    const bookingCollection = client.db(`${process.env.DB_NAME}`).collection("booking");
    
    
    app.post('/booking', (req, res) => {
        const booking = req.body;
        console.log(booking)
        bookingCollection.insertOne(booking)
        .then(result => {
          res.send(result.insertedCount)
        })
    })
    app.get('/bookings', (req, res) => {
        bookingCollection.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })
      })
      app.get('/bookingList', (req, res) => {
        console.log(req.query.email, 'email')
        bookingCollection.find({email: req.query.email})
        .toArray((err, documents) => {
            res.send(documents)
        })
      })

});


app.listen(process.env.PORT || port)