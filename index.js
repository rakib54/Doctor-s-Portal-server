const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;


const app = express()

app.use(bodyParser.json())
app.use(cors())

const port = 5000


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c4bol.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const appointmentCollection = client.db("DoctorsPortal").collection("Appointment");
    console.log('database Connected');
    
    app.post('/addAppointment', (req, res)=>{
        const appointment = req.body
        console.log(appointment);
        appointmentCollection.insertOne(appointment)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

    app.post('/addAppointmentByDate', (req, res)=>{
        const date = req.body
        console.log(date.date);
        appointmentCollection.find({date :date.date})
        .toArray((err,documents) =>{
            res.send(documents)
        })
    })

});


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port)