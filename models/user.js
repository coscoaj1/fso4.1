const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const validate = require('mongoose-validator');

const nameValidator = [
	validate({
		validator: 'isLength',
		arguments: [3, 50],
		message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters',
	}),
	validate({
		validator: 'isAlphanumeric',
		passIfEmpty: true,
		message: 'Name should contain alpha-numeric characters only',
	}),
];

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		validate: nameValidator,
	},

	name: String,
	passwordHash: {
		type: String,
		required: true,
	},
	blogs: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Blog',
		},
	],
});

userSchema.plugin(uniqueValidator);

userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
		delete returnedObject.passwordHash;
	},
});

const User = mongoose.model('User', userSchema);

module.exports = User;
