const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Person = require('./models/person');

// configure middleware
const app = express();
app.use(cors());
app.use(express.static('dist'));
app.use(express.json());

morgan.token('body', (req, res) => {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

//let persons = [
//    { 
//      "id": "1",
//      "name": "Arto Hellas", 
//      "number": "040-123456"
//    },
//    { 
//      "id": "2",
//      "name": "Ada Lovelace", 
//      "number": "39-44-5323523"
//    },
//    { 
//      "id": "3",
//      "name": "Dan Abramov", 
//      "number": "12-43-234345"
//    },
//    { 
//      "id": "4",
//      "name": "Mary Poppendieck", 
//      "number": "39-23-6423122"
//    }
//]

app.get('/api/persons', (req, res) => {
    Person.find({}).then( persons => {
        res.json(persons)
    })
})

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id)
        .then( person => {
            if(!person) {
                return res.status(404).end()
            }

            res.json(person)
        })
})

app.get('/info', (req, res) => {
    res.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date().toDateString()}</p>
    `)
})

app.delete('/api/persons/:id', (req, res) => {
    persons = persons.filter(person => person.id !== req.params.id)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if(!body.name || !body.number) {
        return res.status(400).json({
            error: 'Person\'s name or phone number is missing'
        })
    }

    if(body.name === 'McLovin') {
        return res.status(400).json({
            error: 'It was between that and Mohammed'
        })
    }

    //if(persons.find(person => person.name === body.name)) {
    //    return res.status(400).json({
    //        error: `${body.name} already exists in the phonebook`
    //    })
    //}

    const person = new Person({
        name: body.name,
        number: body.number//,
        //id: Math.floor(Math.random() * 100000000).toString()
    })

    person.save().then(savedPerson => res.json(person))
})

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})