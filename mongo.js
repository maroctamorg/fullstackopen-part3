const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: '.env' })
const connectionString = process.env.MONGODB_CONNECTION_STRING

if(process.argv.length !== 2 && process.argv.length !== 4) {
    console.log('Usage: node mongo.js [name] [number]')
    process.exit(1)
}

mongoose.set('strictQuery', false)
mongoose.connect(connectionString)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})
const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 2) {
    Person.find({}).then( result => {
        console.log('phonebook:')
        result.forEach( person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
    return
}

const person = new Person({
    name: process.argv[2],
    number: process.argv[3]
})

person.save().then( () => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
})