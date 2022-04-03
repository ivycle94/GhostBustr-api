// import our dependecies, middleware and models 
const express = require('express')
const passport = require('passport')
const Place = require('../models/place')
const Visit = require('../models/visit')
const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const requireToken = passport.authenticate('bearer', { session: false })
const removeBlanks = require('../../lib/remove_blank_fields')

const router = express.Router()

// ROUTES GO HERE

// INDEX
// GET /myvisits
router.get('/myvisits', (req, res, next) => {
    Visit.find()
        .populate('owner')
        .then(handle404)
        .then((visit) => {
            // requireOwnership(req, visit)
            return visit.map((visit) => visit.toObject())
        })
        .then((visit) => res.status(200).json({ visit: visit }))
        .catch(next)
})

// POST -> create a visit
// POST /visit/<place_id>
router.post('/visit/:placeId', requireToken, removeBlanks, (req, res, next) => {
    const visit = req.body.visit
    visit.destination = req.params.placeId
    req.body.visit.owner = req.user.id

    Visit.create(visit)
        .then((visit) => {
            console.log('this was returned from create', visit)
            res.status(201).json({ visit: visit.toObject() })
        })
        .catch(next)
})


// SHOW
// GET /visit/5a7db6c74d55bc51bdf39793
router.get('/visit/:id', (req, res, next) => {
    const visitId = req.params.id
    Visit.findById(visitId)
        .populate('owner')
        .then(handle404)
        .then((visit) => {
            res.status(200).json({ visit: visit.toObject() })
                // if an error occurs, pass it to the handler
                .catch(next)

        })
})

// UPDATE
// PATCH /visit/<place_id>/<visit_id>
router.patch('/visit/:placeId/:visitId', requireToken, removeBlanks, (req, res, next) => {
    const visitId = req.params.visitId
    // const placeId = req.params.placeId

    Visit.findById(visitId)
        .then(handle404)
        .then((visit) => {
            // pass the `req` object and the Mongoose record to `requireOwnership`
            // it will throw an error if the current user isn't the owner
            requireOwnership(req, visit)

            // pass the result of Mongoose's `.update` to the next `.then`
            return visit.updateOne(req.body.visit)
        })
        // if that succeeded, return 204 and no JSON
        .then(() => res.sendStatus(204))
        // if an error occurs, pass it to the handler
        .catch(next)

})


// DELETE -> delete a visit
// DELETE /visit/<place_id>/<visit_id>
router.delete('/visit/:placeId/:visitId', requireToken, (req, res, next) => {
    const visitId = req.params.visitId
    Visit.findById(visitId)
        .then(handle404)
        .then((visit) => {
            requireOwnership(req, visit)
            visit.remove()
        })
        // send 204 no content
        .then(() => res.sendStatus(204))
        .catch(next)
})




module.exports = router