/**
 * Created by Sega on 29/03/2017.
 */
'use strict';
const mongoose = require('mongoose');


mongoose.connect('mongodb://45.77.36.109:27017/quickjobfind', {
	useMongoClient: true,
	user: "sega",
	pass: "sega4deptrai",
	auth: {
		authdb: 'admin'
	}
});
module.exports = mongoose;

