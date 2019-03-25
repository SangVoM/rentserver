'use strict';


const mongoose = require("./connect");
const Schema = require("mongoose/lib/schema");


const productSchema = mongoose.Schema({
    email                           : String,
    phone                           : String,
    encrypted_temp_password         : String,
    salt                            : String,
    created_at                      : String
});

mongoose.Promise = global.Promise;

module.exports = mongoose.model('password_reset_request', productSchema);