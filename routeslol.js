'use strict';





const path = require('path');
const request = require("request");

const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const ObjectId = require("mongodb").ObjectID;
const url = "mongodb://sega:sega4deptrai@45.77.36.109:27017/lol?authSource=admin";
module.exports = router => {

	router.get('/listchampion', function(req, res){
		request({
			method: "GET",
			url: "http://ddragon.leagueoflegends.com/cdn/7.24.1/data/vn_VN/champion.json",
			json: true
		}, function(err, response, body) {

			console.log(err);
			res.json(body);
			MongoClient.connect(url, function(err, db) {
				assert.equal(null, err);
				db.collection('champion').insertOne( {body
				}, function(err, result) {
					assert.equal(err, null);
					console.log("Inserted a document into the restaurants collection.");
					db.close();
				});
			});



		})

	});

};
