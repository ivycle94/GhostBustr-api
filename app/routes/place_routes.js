// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for examples
const Place = require('../models/place')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /spookyplaces
router.get('/spookyplaces', (req, res, next) => {
	Place.find()
		.then((place) => {
			// `place` will be an array of Mongoose documents
			// we want to convert each one to a POJO, so we use `.map` to
			// apply `.toObject` to each one
			return place.map((place) => place.toObject())
		})
		// respond with status 200 and JSON of the place
		.then((place) => res.status(200).json({ places: place }))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// SHOW
// GET /spookyplaces/5a7db6c74d55bc51bdf39793
router.get('/spookyplaces/:id', (req, res, next) => {
	// req.params.id will be set based on the `:id` in the route
	Place.findById(req.params.id)
		.populate('owner')
		.then(handle404)
		// if `findById` is succesful, respond with 200 and "example" JSON

		.then((place) => res.status(200).json({ place: place.toObject() }))
		// if an error occurs, pass it to the handler
		.catch(next)
})



// CREATE
// POST /spookyplaces
router.post('/spookyplaces', requireToken, (req, res, next) => {
	// set owner of new example to be current user
	req.body.place.owner = req.user.id

	Place.create(req.body.place)
		// respond to succesful `create` with status 201 and JSON of new "place"
		.then((place) => {
			res.status(201).json({ place: place.toObject() })
		})
		// if an error occurs, pass it off to our error handler
		// the error handler needs the error message and the `res` object so that it
		// can send an error message back to the client
		.catch(next)
})

// CREATE --> for favorites list route that actually calls the db and makes a new document
// POST /spookyplaces/favorite
router.post('/spookyplaces/newfavorite', requireToken, (req, res, next) => {
	req.body.place.owner = req.user.id

	Place.create(req.body.place)
		.then((place) => {
			requireOwnership(req, place)
			res.status(201).json({ place: place.toObject() })
		})
		.catch(next)
})

// SHOW -->	route to display place selected as a favorite
// GET
router.get('/spookyplaces/mine', (req, res, next) => {
	const { username, userId, loggedIn } = req.session
	Place.find({ owner: userId })
		.then((place) => res.status(200).json({ place: place.toObject() }))

		.catch(next)

})

// UPDATE
// PATCH /spookyplaces/5a7db6c74d55bc51bdf39793
router.patch('/spookyplaces/:id', requireToken, removeBlanks, (req, res, next) => {
	// if the client attempts to change the `owner` property by including a new
	// owner, prevent that by deleting that key/value pair
	delete req.body.place.owner

	Place.findById(req.params.id)
		.then(handle404)
		.then((place) => {
			// pass the `req` object and the Mongoose record to `requireOwnership`
			// it will throw an error if the current user isn't the owner
			requireOwnership(req, place)
			console.log('placeeeeee', place)

			// pass the result of Mongoose's `.update` to the next `.then`
			return place.updateOne(req.body.place)
		})
		// if that succeeded, return 204 and no JSON
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// DESTROY
// DELETE /spookyplaces/5a7db6c74d55bc51bdf39793
router.delete('/spookyplaces/:id', requireToken, (req, res, next) => {
	Place.findById(req.params.id)
		.then(handle404)
		.then((place) => {
			// throw an error if current user doesn't own `place`
			requireOwnership(req, place)
			// delete the place ONLY IF the above didn't throw
			place.deleteOne()
		})
		// send back 204 and no content if the deletion succeeded
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})

module.exports = router
