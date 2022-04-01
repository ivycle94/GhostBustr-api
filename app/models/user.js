const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		hashedPassword: {
			type: String,
			required: true,
		},
		token: {
			type: String
		},
		timestamps: true,
		toObject: {
			// remove `hashedPassword` field when we call `.toObject`
			transform: (_doc, user) => {
				delete user.hashedPassword
				return user
			},
		},
	}
)

// once we have the visited model, we may need to add the objectId of the visit
// [{ type : ObjectId, ref: 'Visit' }]

module.exports = mongoose.model('User', userSchema)
