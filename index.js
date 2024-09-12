const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')

// configure middleware
const app = express()
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (req, res) => {
    Person.find({}).then( persons => {
        res.json(persons)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then( person => {
            if(!person) {
                return res.status(404).end()
            }

            res.json(person)
        })
        .catch( error => next(error))
})

app.get('/info', (req, res) => {
    Person.find({})
        .then( persons => {
            res.send(`
                <p>Phonebook has info for ${persons.length} people</p>
                <p>${new Date().toDateString()}</p>
            `)
        }
        )
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(() => res.status(204).end())
        .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
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

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => res.json(savedPerson)).catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true, context: 'query' })
        .then(updatedPerson => res.json(updatedPerson))
        .catch(error => next(error))
}
)

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    }

    if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }

    next(error)
}
app.use(errorHandler)

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})