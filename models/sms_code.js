'use strict';


const mongoose = require("./connect");
const Schema = require("mongoose/lib/schema");


const productSchema = mongoose.Schema({
    iduser              : {type: Schema.Types.ObjectId, ref: 'user'},
    code                : String,
    status              : String,
    created_at          : String
});

mongoose.Promise = global.Promise;

module.exports = mongoose.model('sms_code', productSchema);