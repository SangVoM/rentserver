"use strict";

const user = new require("../models/user");
const bcrypt = new require("bcryptjs");
const speedsms = require("./speedsms");
const randomstring = require("randomstring");

exports.loginUser = (phone) =>

	new Promise((resolve, reject) => {
		const salt = bcrypt.genSaltSync(10);
		const random = randomstring.generate({
			length: 6,
			charset: "numeric"
		});
		const code = bcrypt.hashSync(random, salt);

		user.find({phone: phone}, {listproduct: 0, listsavedproduct: 0})

			.then(users => {

				if (users.length === 0) {

					reject({status: 404, message: "User Not Found !"});

				} else {

					return users[0];


				}
			})

			.then(user => {

				user.temp_password = code;
				user.temp_password_time = new Date();
				user.save();
				speedsms.sendsms(phone,"Dùng " + random + " để xác minh tài khoản Thuê Tốt của bạn!", "", "", 1);
				resolve({
					status: 202,
					message: "Check code !"
				});
			})

			.catch(err => {
				console.log(err.message);
				reject({status: 500, message: err.message});
			});

	});
exports.loginFinish = (phone, code, tokenfirebase) =>
	new Promise((resolve, reject) => {

		user.find({phone: phone})

			.then(users => {
				let diff;

				diff = new Date() - new Date(users[0].temp_password_time);
				const seconds = Math.floor(diff / 1000);


				if (seconds < 300) {
					return users[0];
				} else {
					reject({status: 405, message: "Time Out ! Try again"});
				}
			}).then(usertemp => {

			if (bcrypt.compareSync(code, usertemp.temp_password)) {

				usertemp.temp_password = undefined;
				usertemp.tokenfirebase = tokenfirebase;
				usertemp.temp_password_time = undefined;
				usertemp.status_code = "1";
				usertemp.save();
				resolve({status: 200, user: usertemp});
			} else {
				reject({status: 401, message: "Invalid Code !"});
			}


		})

			.then(usertemp => resolve({status: 200, message: "Register Successfully !", user: usertemp}))

			.catch(err => {
				console.log(err.message);
				reject({status: 500, message: err.message});
			});

	});