const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())
app.use(morgan('tiny'))

let persons = [
    { 
      id: 1,
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: 2,
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: 3,
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: 4,
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
]

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
    res.json(persons)
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

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

const generateId = () => {
    return Math.random() * (9999999999 - 1) + 1
}

app.post('/api/persons', (req, res) => {
    const body = req.body

    const isDuplicate = persons.some(person => person.name === body.name)

    if (!body.name) {
        return res.status(400).json({
            error: "name is missing"
        })
    } else if (!body.number) {
        return res.status(400).json({
            error: "number is missing"
        })
    } else if (isDuplicate) {
        return res.status(400).json({
            error: "name must be unique"
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
