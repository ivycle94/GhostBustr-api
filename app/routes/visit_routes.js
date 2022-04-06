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
// GET /myvisits/<user_id>
router.get('/myvisits/:userId', (req, res, next) => {
    // console.log('My visit req.user._id', req.user.id);
    Visit.find({ owner: req.params.userId })
        .populate('owner')
        .populate('destination')
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
    const visitId = req.params.id

    visit.destination = req.params.placeId
    req.body.visit.owner = req.user.id
    console.log('req.params.placeId', req.params.placeId);

    Place.findById(req.params.placeId)
        // .then(handle404)
        .then(place => {
            console.log('this is place', place);
            Visit.create(visit)
                .then((visit) => {
                    console.log('this was returned from create', visit)
                    console.log("visit owner", visit.owner);
                    // console.log('this is place #2', place);


                    place.visitors.push(visit.owner)
                    place.save()
                    res.status(201).json({ visit: visit.toObject() })


                })

        })
})


// SHOW
// GET /visit/5a7db6c74d55bc51bdf39793
router.get('/myvisit/:id', (req, res, next) => {
    const visitId = req.params.id
    Visit.findById(visitId)
        .populate('owner')
        .populate('destination')
        .then(handle404)
        .then((visit) => {
            res.status(200).json({ visit: visit.toObject() })
            // if an error occurs, pass it to the handler
            // .catch(next)

        })
})

// UPDATE
// PATCH /visit/<place_id>/<visit_id>
router.patch('/visit/:visitId', requireToken, removeBlanks, (req, res, next) => {
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
router.delete('/visit/:visitId', requireToken, (req, res, next) => {
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