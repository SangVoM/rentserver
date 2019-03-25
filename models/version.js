'use strict';

const mongoose = require("./connect");

const userSchema = mongoose.Schema({
	version_code            : String,
	version_name 			: String
});

mongoose.Promise = global.Promise;
module.exports = mongoose.model('version', userSchema);