'use strict';


const mongoose = require("./connect");
const Schema = require("mongoose/lib/schema");


const saveproSchema = mongoose.Schema({
    user                :{type: Schema.Types.ObjectId, ref: 'user'},
    productid           :[{type: Schema.Types.ObjectId, ref: 'product'}]
});

mongoose.Promise = global.Promise;

module.exports = mongoose.model('ProductSave', saveproSchema);