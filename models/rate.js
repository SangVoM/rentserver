'use strict';


const mongoose = require("./connect");
const Schema = require("mongoose/lib/schema");


const productSchema = mongoose.Schema({
    iduserated              : {type: Schema.Types.ObjectId, ref: 'user'},
    idusereceive            : {type: Schema.Types.ObjectId, ref: 'user'},
    point                   : String,
    time                    : String
});

mongoose.Promise = global.Promise;

module.exports = mongoose.model('rate', productSchema);