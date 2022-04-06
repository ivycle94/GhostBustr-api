const mongoose = require('mongoose')
const User = require('./user')
const Place = require('./place')

const { Schema, model } = mongoose


const visitSchema = new Schema(
    {
        visitFromDate: {
            type: Date,
            // required: true,
        },
        visitToDate: {
            type: Date,
            // required: true,
        },
        description: {
            type: String,
            // required: true,
        },
        visitRating: {
            type: Number,
            min: 1,
            max: 5
        },
        destination: {
            type: Schema.Types.ObjectId,
            ref: 'Place'
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }, {
    timestamps: true
}
)


module.exports = model('Visit', visitSchema)