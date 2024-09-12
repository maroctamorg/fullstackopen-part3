const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: '.env' })

// configure mongoose
const connectionString = process.env.MONGODB_CONNECTION_STRING
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
    name: {
        type: String,
        minLength: 3,
        required: [true, 'Name required']
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: v => /(\d{3}|\d{2})-\d+/.test(v),
            message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'Phone number required']
    }
})
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)