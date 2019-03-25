'use strict';

const mongoose = require("./connect");
const Schema = require("mongoose/lib/schema");

const chatSchema = mongoose.Schema({
	userfrom             : {type: Schema.Types.ObjectId, ref: 'user'},
	userto             : {type: Schema.Types.ObjectId, ref: 'user'},
	messages             : [{
		photoprofile: { type: String },
		email: { type: String },
		name: { type: String },
		message : {type : String },
		created_at        : String
	}]
});

mongoose.Promise = global.Promise;

module.exports = mongoose.model('chat', chatSchema);