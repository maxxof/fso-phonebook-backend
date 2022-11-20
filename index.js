require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require('./models/person.js')
const cors = require('cors')

app.use(express.json())

app.use(cors())

app.use(express.static('build'))

morgan.token('body', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = []

const Info = () => {
    const time = new Date()
    return (
        `<div>
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${time}</p>
        </div>`
    )
}

app.get("/api/persons", (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get("/info", (req, res) => {
    res.send(Info())
})

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete("/api/persons/:id", (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(err => next(err))
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name) {
        return res.status(400).json({
            error: "name is missing"
        })
    } else if (!body.number) {
        return res.status(400).json({
            error: "number is missing"
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
  }
  
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})