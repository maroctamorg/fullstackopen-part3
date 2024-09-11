const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

// configure mongoose
const connectionString = process.env.MONGODB_CONNECTION_STRING;
mongoose.set('strictQuery', false)
mongoose.connect(connectionString)
    .then( () => {
        console.log('connected to MongoDB')
    })
    .catch( error => {
        console.log('error connecting to MongoDB:', error.message)
    })


// define person schema and model
const personSchema = new mongoose.Schema({
    name: String,
    number: String
})
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)