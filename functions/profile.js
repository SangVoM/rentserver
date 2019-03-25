'use strict';
const user = new require('../models/user');
const fun_product = require('./fun_product');
const version = new require('../models/version');


exports.getProfile = userid =>

    new Promise((resolve,reject) => {

        let ObjectId;
        ObjectId = require('mongodb').ObjectID;

        user.find({ _id: ObjectId(userid)},{listproduct: 0,listsavedproduct: 0})
            .exec(function (err, post) {
                if(err) throw err;
                console.log(post);


            })
            .then(users => {

					resolve(users[0]);
            }

            )
            .catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

    });

exports.getFullProfile = userid =>

	new Promise((resolve,reject) => {

		let ObjectId;
		ObjectId = require('mongodb').ObjectID;

		user.find({ _id: ObjectId(userid)},{listproduct: 1 })
			.populate({
				path: "listproduct",
				select: "-comment",
				options: {sort: {"time": -1}},
				populate: {path: "user", select: "-listproduct -listsavedproduct"}
				// Get friends of friends - populate the 'friends' array for every friend
			})



			.then(users => {
				console.log(users[0]);
				resolve({status: 201, user : users[0]});

				}

			)
			.catch(err => reject({ status: 500, message: 'Internal Server Error !' }))

	});
exports.editInfoUser = (userid,newname,newphone) =>

	new Promise((resolve,reject) => {

		let ObjectId;
		ObjectId = require('mongodb').ObjectID;

		user.findByIdAndUpdate(
			userid,
			{$set: {"name": newname, "phone": newphone}},
			{safe: true, upsert: true, new: true,select: "-listproduct -listsavedproduct"},
			function (err, model) {
				console.log(err);
				resolve({status: 200, user: model});
			}
		)
	});
exports.editPhoneNumber = (userid,phone) =>

	new Promise((resolve,reject) => {

		let ObjectId;
		ObjectId = require('mongodb').ObjectID;

		user.findByIdAndUpdate(
			userid,
			{$set: {"phone": phone}},
			{safe: true, upsert: true, new: true,select: "-listproduct -listsavedproduct"},
			function (err, model) {
				console.log(err);
				resolve({status: 200, user: model});
			}
		)
	});
exports.getversion = () =>
	new Promise((resolve,reject) => {
		version.find({},function (err,data) {
			if(err) throw err;
			resolve({status: 200, message: data[0].version_name});
		})
	});

exports.newversion = () =>

	new Promise((resolve,reject) => {
		let newVersion;
		newVersion = new version({
			version_name: "32.13.2",
			version_code: "32.1.4"
		});
		newVersion.save();
	});
