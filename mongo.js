const mongoose = require('mongoose')

let addPerson = false

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
} else if (process.argv.length === 5) {
    addPerson = true
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.ehrikjy.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (addPerson) {
    const name = process.argv[3]
    const number = process.argv[4]
    mongoose
        .connect(url)
        .then((result) => {
            const person = new Person({
                name,
                number
            })
            return person.save()
        })
        .then(() => {
            console.log(`added ${name} number ${number} to phonebook`)
            return mongoose.connection.close()
        })
        .catch((err) => console.log(err))

} else {
    mongoose
        .connect(url)
        .then((result) => {
            Person
            .find({})
            .then(persons => {
                persons.forEach(p => {
                    console.log(p)
                })
                mongoose.connection.close()
            })
        })
}