'use strict';

const mongoose = require("./connect");
const Schema = require("mongoose/lib/schema");

const userSchema = mongoose.Schema({
    name             : String,
	phone : { type: String, unique: true },
	email : String,
	referral : String,
	totalreferralpoint : Number,
    hashed_password    : String,
    created_at        : String,
    photoprofile : String,
    tokenfirebase : String,
	temp_password : String,
	temp_password_time : String,
    status_code : String,
	status_block : String,
    facebook :{
        id : String,
        token : String,
        email: String,
        photoprofile    :String,
        name : String,
		temp_password : String,
		temp_password_time : String,
		status_code : String

    },
    google :{
        id : String,
        token : String,
        email: String,
        photoprofile    :String,
        name : String,
		temp_password : String,
		temp_password_time : String,
		status_code : String
    },
	AndroidId : String,
    listproduct: [{type: Schema.Types.ObjectId, ref: 'product'}],
	listsavedproduct: [{type: Schema.Types.ObjectId, ref: 'product'}]

});

mongoose.Promise = global.Promise;

module.exports = mongoose.model('user', userSchema);