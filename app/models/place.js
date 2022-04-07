const mongoose = require('mongoose')
const User = require('./user')

const { Schema, model } = mongoose

const placeSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        scareLevel: {
            type: Number,
            min: 1,
            max: 5
        },
        visitors: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }, {
    timestamps: true,
    //  we're going to add virtuals to our model
    // these lines ensure that the virtual will be included
    // whenever we turn our document to an object or JSON
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
}
)

// virtuals go here(we'll build these later)
// a virtual is a virtual property, that uses the data that's saved in teh database, to add a property whenever we retrieve that document & convert it to an object
// using classic function to be able to use 'this.' in the function
// arrow function would go up in scope outside of object
placeSchema.virtual('scareFactor').get(function () {
    // we can do whatever javascripty things we want in here
    // we just need to make sure that we return some value
    // scareFactor is going to tcombine the name, location & scareLevel to build a title
    return `${this.name} in ${this.location} is spookin' ${this.scareLevel} out of 10`
})


module.exports = model('Place', placeSchema)