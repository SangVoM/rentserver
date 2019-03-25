"use strict";

const user = new require("../models/user");
const bcrypt = new require("bcryptjs");
const speedsms = new require("../functions/speedsms");
const randomstring = new require("randomstring");
const nodemailer = new require("nodemailer");
const ObjectId = require("mongodb").ObjectID;
const FCM = require("fcm-node");
const fcm = new FCM("AIzaSyDbZnEq9-lpTvAk41v_fSe_ijKRIIj6R6Y");
exports.blockuser = (userid) =>

	new Promise((resolve, reject) => {

		user.find({_id: userid})

			.then(users => {

				if (users.length === 0) {
					resolve({status: 404, message: "User Not Found"});
				} else {
					users[0].status_code = 3;
					users[0].save();
					const m = {
						to: users[0].tokenfirebase,

						data: {
							userblock: users[0]._id
						}
					};

					fcm.send(m, function (err, response) {
						if (err) {
							console.log(err);
							reject({status: 409, message: "MessToTopic Error !"});
						} else {
							console.log(response);
							resolve({
								status: 201,
								message: "MessToTopic Sucessfully !",
								response: response
							});

						}
					});


				}
			})

			.catch(err => {
				console.log(err.message);
				reject({status: 500, message: err.message});
			});

	});

exports.verifyemail = (email) =>

	new Promise((resolve, reject) => {

		user.find({email: email})

			.then(users => {

				if (users.length === 0) {
					resolve({status: 200, message: "Ok"});

				} else {

					reject({status: 404, message: "User Already Registered !"});

				}
			})

			.catch(err => {
				console.log(err.message);
				reject({status: 500, message: err.message});
			});

	});
exports.referraltoken = (id, phone,token) =>

	new Promise((resolve, reject) => {
		user.find({tokenfirebase: {$regex: token},referral: phone} ,function (err,data) {
			if(err){throw err.message;}
			console.log(data.length);
			console.log(token);
			console.log(phone);
			if(data.length >=2){
				reject({status: 405, message: "Phone userd more 3 device"});
			}else{
				user.find({_id: ObjectId(id), status_code: "1"},{listproduct :0 ,listsavedproduct : 0})
					.then(users2 => {
						if(users2[0].referral ===undefined)
						{
							user.find({phone: phone, status_code: "1"},{listproduct :0 ,listsavedproduct : 0})

								.then(users => {

									if (users.length === 0) {
										reject({status: 404, message: "Phone not found"});

									} else {

										users2[0].referral = phone;
										users2[0].totalreferralpoint = users2[0].totalreferralpoint + 1;
										users[0].totalreferralpoint = users[0].totalreferralpoint + 1;
										users2[0].save();
										users[0].save();
										resolve({status: 200, user: users2[0], message : "Success"});

									}
								})

								.catch(err => {
									console.log(err.message);
									reject({status: 500, message: err.message});
								});
						}
						else
						{
							console.log("loi roi em oi");+
							reject({status: 500, message: "loi roi em oi"});
						}

					})

					.catch(err => {
						console.log(err.message);+
							reject({status: 500, message: err.message});
					});
			}
		});



	});
exports.referralAndroidId= (id, phone,token) =>

	new Promise((resolve, reject) => {
		user.find({AndroidId: {$regex: token},referral: phone} ,function (err,data) {
			if(err){throw err.message;}
			console.log(data.length);
			console.log(token);
			console.log(phone);
			if(data.length >=1){
				reject({status: 405, message: "Phone userd more 3 device"});
			}else{
				user.find({_id: ObjectId(id), status_code: "1"},{listproduct :0 ,listsavedproduct : 0})
					.then(users2 => {
						if(users2[0].referral === undefined || users2[0].referral === "")
						{
							user.find({phone: phone, status_code: "1"},{listproduct :0 ,listsavedproduct : 0})

								.then(users => {
									if (users.length === 0) {
										reject({status: 404, message: "Phone not found"});

									} else {
										if(phone === users2[0].phone) {
											reject({status: 404, message: "Phone not found"});
										} else {
											if(users[0].status_block === undefined) {
												users2[0].referral = phone;
												users2[0].totalreferralpoint = users2[0].totalreferralpoint + 1;
												users[0].totalreferralpoint = users[0].totalreferralpoint + 1;
												users2[0].save();
												users[0].save();
												resolve({status: 200, user: users2[0], message : "Success"});
											} else {
												reject({status: 406, message: "User blocked !"});
											}
										}

									}
								})

								.catch(err => {
									console.log(err.message);
									reject({status: 500, message: err.message});
								});
						}
						else
						{
							console.log("loi roi em oi");+
							reject({status: 500, message: "loi roi em oi"});
						}

					})

					.catch(err => {
						console.log(err.message);+
							reject({status: 500, message: err.message});
					});
			}
		});



	});
exports.referral = (id, phone) =>

	new Promise((resolve, reject) => {
		user.find({_id: ObjectId(id), status_code: "1"},{listproduct :0 ,listsavedproduct : 0})
			.then(users2 => {
				if(users2[0].referral === undefined)
				{
					user.find({phone: phone, status_code: "1"},{listproduct :0 ,listsavedproduct : 0})

						.then(users => {

							if (users.length === 0) {
								reject({status: 404, message: "Phone not found"});

							} else {

								users2[0].referral = phone;
								users2[0].totalreferralpoint = users2[0].totalreferralpoint + 1;
								users[0].totalreferralpoint = users[0].totalreferralpoint + 1;
								users2[0].save();
								users[0].save();
								resolve({status: 200, user: users2[0], message : "Success"});

							}
						})

						.catch(err => {
							console.log(err.message);
							reject({status: 500, message: err.message});
						});
				}
				else
				{
					console.log("loi roi em oi");+
					reject({status: 500, message: "loi roi em oi"});
				}

			})

			.catch(err => {
				console.log(err.message);+
					reject({status: 500, message: err.message});
			});


	});
exports.cancelreferral = (id) =>

	new Promise((resolve, reject) => {


					user.find({_id: ObjectId(id), status_code: "1"},{listproduct :0 ,listsavedproduct : 0})

						.then(users => {
							users[0].referral = "null";
							users[0].save();
							resolve({status: 200, user: users[0], message : "Success"});


						})

						.catch(err => {
							console.log(err.message);
							reject({status: 500, message: err.message});
						});



	});

exports.registerUser = (id, token, name, email, password, photoprofile, type, tokenfirebase) =>

	new Promise((resolve, reject) => {
		console.log(type);
		if (type === 1) {

			user.find({"facebook.email": email}, {listproduct: 0, listsavedproduct: 0})

				.then(user => {

					if (user.length === 0) {
						resolve({status: 201, message: "Dont link any account !"});

					}
					else {
						if (user.length == 1) {
							if (user[0].status_code === "0") {
								resolve({status: 201, message: "Dont link any account !"});
							}
							else {
								if (user[0].facebook.status_code === "0") {
									resolve({status: 201, message: "Dont link any account !"});

								}
								else {
									user[0].tokenfirebase = tokenfirebase;
									user[0].save();
									resolve({
										status: 200,
										message: "User Login Sucessfully !",
										user: user[0]
									});
								}
							}
						} else {
							for (var i = 0; i < user.length; i++) {
								if (user[i].facebook.status_code === "1") {
									user[i].tokenfirebase = tokenfirebase;
									user[i].save();
									resolve({
										status: 200,
										message: "User Login Sucessfully !",
										user: user[i]
									});
									break;
								}
								if (i == (user.length - 1)) {
									resolve({status: 201, message: "Dont link any account !"});
								}
							}

						}
					}
				})
				.catch(err => {
					console.log(err.message);
					reject({status: 500, message: err.message});
				});
		}
		else {

			user.find({"google.email": email}, {listproduct: 0, listsavedproduct: 0})

				.then(user => {

					if (user.length === 0) {

						resolve({status: 201, message: "Dont link any account !"});


					}
					else {
						if (user.length == 1) {
							if (user[0].google.status_code === "0") {

								resolve({status: 201, message: "Dont link any account !"});

							}
							else {
								user[0].tokenfirebase = tokenfirebase;
								user[0].save();
								resolve({
									status: 200,
									message: "User Registered Sucessfully !",
									user: user[0]
								});
							}
						} else {
							for (var i = 0; i < user.length; i++) {
								if (user[i].google.status_code === "1") {
									user[i].tokenfirebase = tokenfirebase;
									user[i].save();
									resolve({
										status: 200,
										message: "User Login Sucessfully !",
										user: user[i]
									});
									break;
								}
								if (i == (user.length - 1)) {
									resolve({status: 201, message: "Dont link any account !"});
								}
							}
						}


					}
				})
				.catch(err => {
					console.log(err.message);
					reject({status: 500, message: err.message});
				});
		}

	});
exports.registerUserLink = (id, token, name, phone, email, password, photoprofile, type, tokenfirebase) =>

	new Promise((resolve, reject) => {
		let code;
		let newUser;
		const random = randomstring.generate({
			length: 6,
			charset: "numeric"
		});
		if (photoprofile == "null" || photoprofile == "") {
			console.log("profile null");
			photoprofile = "no_avatar.png";
		}
		const salt = bcrypt.genSaltSync(10);

		code = bcrypt.hashSync(random, salt);

		if (type === 1) {

			user.find({phone: phone}, {listproduct: 0, listsavedproduct: 0})

				.then(users => {

					if (users.length !== 0) {
						if (users[0].status_code === "1") {
							if (users[0].facebook.status_code === "0" || users[0].facebook.status_code === undefined) {

								users[0].facebook.name = name;
								users[0].facebook.id = id;
								users[0].facebook.token = token;
								users[0].facebook.email = email;
								users[0].facebook.photoprofile = photoprofile;
								users[0].tokenfirebase = tokenfirebase;
								users[0].facebook.temp_password = code;
								users[0].facebook.temp_password_time = new Date();
								users[0].facebook.status_code = "0"
								37
								users[0].save();
								speedsms.sendsms(phone, "Dùng " + random + " để xác minh tài khoản Thuê Tốt của bạn!", "", "", 1);
								resolve({
									status: 202,
									message: "Check code !"
								});
							}
							else {
								users[0].tokenfirebase = tokenfirebase;
								users[0].save();
								reject({
									status: 409,
									message: "Da Ton Tai"

								});
							}

						}
						else {
							users[0].name = name;
							users[0].email = email;
							users[0].photoprofile = photoprofile;
							users[0].created_at = new Date();
							users[0].status_code = "0";
							users[0].hashed_password = undefined;
							users[0].facebook.name = name;
							users[0].facebook.id = id;
							users[0].facebook.email = email;
							users[0].facebook.token = token;
							users[0].facebook.photoprofile = photoprofile;
							users[0].tokenfirebase = tokenfirebase;
							users[0].facebook.temp_password = code;
							users[0].facebook.temp_password_time = new Date();
							users[0].facebook.status_code = "0";
							users[0].save();
							speedsms.sendsms(phone, "Dùng " + random + " để xác minh tài khoản Thuê Tốt của bạn!", "", "", 1);
							resolve({
								status: 202,
								message: "Check code !"
							});
						}

					}
					else {

						newUser = new user({
							name: name,
							email: email,
							hashed_password: "",
							phone: phone,
							totalreferralpoint : 20000,
							photoprofile: photoprofile,
							tokenfirebase: tokenfirebase,
							created_at: new Date(),
							status_code: "0",

							facebook: {
								id: id,
								token: token,
								name: name,
								email: email,
								photoprofile: photoprofile,
								temp_password: code,
								temp_password_time: new Date(),
								status_code: "0"
							}
						});

						newUser.save();
						speedsms.sendsms(phone, "Dùng " + random + " để xác minh tài khoản Thuê Tốt của bạn!", "", "", 1);
						resolve({
							status: 202,
							message: "Check code !"
						});
					}
				})
				.catch(err => {
					console.log(err.message);
					reject({status: 500, message: err.message});
				});
		}
		else if (type === 2) {
			user.find({phone: phone}, {listproduct: 0, listsavedproduct: 0})

				.then(users => {

					if (users.length !== 0) {
						if (users[0].status_code === "1") {
							if (users[0].google.status_code === "0" || users[0].google.status_code === undefined) {

								users[0].google.name = name;
								users[0].google.id = id;
								users[0].google.token = token;
								users[0].google.email = email;
								users[0].google.photoprofile = photoprofile;
								users[0].tokenfirebase = tokenfirebase;
								users[0].google.temp_password = code;
								users[0].google.temp_password_time = new Date();
								users[0].google.status_code = "0";
								users[0].save();
								speedsms.sendsms(phone, "Dùng " + random + " để xác minh tài khoản Thuê Tốt của bạn!", "", "", 1);
								resolve({
									status: 202,
									message: "Check code !"
								});
							}
							else {

								users[0].tokenfirebase = tokenfirebase;
								users[0].save();
								reject({
									status: 409,
									message: "Da Ton Tai"

								});
							}

						}
						else {
							users[0].name = name;
							users[0].email = email;
							users[0].photoprofile = photoprofile;
							users[0].created_at = new Date();
							users[0].status_code = "0";
							users[0].hashed_password = undefined;
							users[0].google.name = name;
							users[0].google.id = id;
							users[0].google.email = email;
							users[0].google.token = token;
							users[0].google.photoprofile = photoprofile;
							users[0].tokenfirebase = tokenfirebase;
							users[0].google.temp_password = code;
							users[0].google.temp_password_time = new Date();
							users[0].google.status_code = "0";
							users[0].save();
							speedsms.sendsms(phone, "Dùng " + random + " để xác minh tài khoản Thuê Tốt của bạn!", "", "", 1);
							resolve({
								status: 202,
								message: "Check code !"
							});
						}

					}
					else {


						newUser = new user({
							name: name,
							email: email,
							hashed_password: "",
							phone: phone,
							totalreferralpoint : 20000,
							photoprofile: photoprofile,
							tokenfirebase: tokenfirebase,
							created_at: new Date(),
							status_code: "0",

							google: {
								id: id,
								token: token,
								name: name,
								email: email,
								photoprofile: photoprofile,
								temp_password: code,
								temp_password_time: new Date(),
								status_code: "0"
							}
						});

						newUser.save();
						speedsms.sendsms(phone,"Dùng " + random + " để xác minh tài khoản Thuê Tốt của bạn!", "", "", 1);
						resolve({
							status: 202,
							message: "Check code !"
						});
					}
				})
				.catch(err => {
					console.log(err.message);
					reject({status: 500, message: err.message});
				});


		}
		else {
			user.find({phone: phone}, {listproduct: 0, listsavedproduct: 0})

				.then(users => {

					if (users.length != 0) {
						if (users[0].status_code === "1") {
							reject({
								status: 409,
								message: "Da Ton Tai"

							});
						}
						else {
							users[0].name = name;
							users[0].email = email;
							users[0].photoprofile = "no_avatar.png";
							users[0].created_at = new Date();
							users[0].status_code = "0";
							users[0].hashed_password = undefined;
							users[0].tokenfirebase = tokenfirebase;
							users[0].temp_password = code;
							users[0].temp_password_time = new Date();
							users[0].status_code = "0";
							users[0].save();
							speedsms.sendsms(phone,"Dùng " + random + " để xác minh tài khoản Thuê Tốt của bạn!", "", "", 1);
							resolve({
								status: 202,
								message: "Check code !"
							});
						}
					}
					else {
						const hash = bcrypt.hashSync(password, salt);
						newUser = new user({
							name: name,
							email: email,
							totalreferralpoint : 20000,
							photoprofile: "no_avatar.png",
							phone: phone,
							hashed_password: undefined,
							tokenfirebase: tokenfirebase,
							created_at: new Date(),
							temp_password: code,
							temp_password_time: new Date(),
							status_code: "0"


						});
						newUser.save();
						speedsms.sendsms(phone,"Dùng " + random + " để xác minh tài khoản Thuê Tốt của bạn!", "", "", 1);
						resolve({
							status: 202,
							message: "Check code !"
						});
					}
				})
				.catch(err => {
					console.log(err.message);
					reject({status: 500, message: err.message});
				});
		}

	});
exports.registerUserLinkDev = (id, token, name, phone, email, password, photoprofile, type, tokenfirebase) =>

	new Promise((resolve, reject) => {
		let code;
		let newUser;
		const random = randomstring.generate({
			length: 6,
			charset: "numeric"
		});
		if (photoprofile == "null" || photoprofile == "") {
			console.log("profile null");
			photoprofile = "no_avatar.png";
		}
		const salt = bcrypt.genSaltSync(10);

		code = bcrypt.hashSync(random, salt);

		if (type === 1) {

			user.find({phone: phone}, {listproduct: 0, listsavedproduct: 0})

				.then(users => {

					if (users.length !== 0) {
						if (users[0].status_code === "1") {
							if (users[0].facebook.status_code === "0" || users[0].facebook.status_code === undefined) {

								users[0].facebook.name = name;
								users[0].facebook.id = id;
								users[0].facebook.token = token;
								users[0].facebook.email = email;
								users[0].facebook.photoprofile = photoprofile;
								users[0].tokenfirebase = tokenfirebase;
								users[0].facebook.temp_password = code;
								users[0].facebook.temp_password_time = new Date();
								users[0].facebook.status_code = "0";
								users[0].save();
								speedsms.sendsms(phone,"Dùng " + random + " để xác minh tài khoản Thuê Tốt của bạn!", "", "", 1);
								resolve({
									status: 202,
									message: "Check code !"
								});
							}
							else {
								users[0].tokenfirebase = tokenfirebase;
								users[0].save();
								reject({
									status: 409,
									message: "Da Ton Tai"

								});
							}

						}
						else {
							users[0].name = name;
							users[0].email = email;
							users[0].photoprofile = photoprofile;
							users[0].created_at = new Date();
							users[0].status_code = "0";
							users[0].hashed_password = undefined;
							users[0].facebook.name = name;
							users[0].facebook.id = id;
							users[0].facebook.email = email;
							users[0].facebook.token = token;
							users[0].facebook.photoprofile = photoprofile;
							users[0].tokenfirebase = tokenfirebase;
							users[0].facebook.temp_password = code;
							users[0].facebook.temp_password_time = new Date();
							users[0].facebook.status_code = "0";
							users[0].save();
							speedsms.sendsms(phone,"Dùng " + random + " để xác minh tài khoản Thuê Tốt của bạn!", "", "", 1);
							resolve({
								status: 202,
								message: "Check code !"
							});
						}

					}
					else {

						newUser = new user({
							name: name,
							email: email,
							hashed_password: "",
							phone: phone,
							totalreferralpoint : 20000,
							photoprofile: photoprofile,
							tokenfirebase: tokenfirebase,
							created_at: new Date(),
							status_code: "0",
							facebook: {
								id: id,
								token: token,
								name: name,
								email: email,
								photoprofile: photoprofile,
								temp_password: code,
								temp_password_time: new Date(),
								status_code: "0"
							}
						});

						newUser.save();
						speedsms.sendsms(phone,"Dùng " + random + " để xác minh tài khoản Thuê Tốt của bạn!", "", "", 1);
						resolve({
							status: 202,
							message: "Check code !"
						});
					}
				})
				.catch(err => {
					console.log(err.message);
					reject({status: 500, message: err.message});
				});
		}
		else if (type === 2) {
			user.find({phone: phone}, {listproduct: 0, listsavedproduct: 0})

				.then(users => {

					if (users.length !== 0) {
						if (users[0].status_code === "1") {
							if (users[0].google.status_code === "0" || users[0].google.status_code === undefined) {

								users[0].google.name = name;
								users[0].google.id = id;
								users[0].google.token = token;
								users[0].google.email = email;
								users[0].google.photoprofile = photoprofile;
								users[0].tokenfirebase = tokenfirebase;
								users[0].google.temp_password = code;
								users[0].google.temp_password_time = new Date();
								users[0].google.status_code = "0";
								users[0].save();
								speedsms.sendsms(phone,"Dùng " + random + " để xác minh tài khoản Thuê Tốt của bạn!", "", "", 1);
								resolve({
									status: 202,
									message: "Check code !"
								});
							}
							else {

								users[0].tokenfirebase = tokenfirebase;
								users[0].save();
								reject({
									status: 409,
									message: "Da Ton Tai"

								});
							}

						}
						else {
							users[0].name = name;
							users[0].email = email;
							users[0].photoprofile = photoprofile;
							users[0].created_at = new Date();
							users[0].status_code = "0";
							users[0].hashed_password = undefined;
							users[0].google.name = name;
							users[0].google.id = id;
							users[0].google.email = email;
							users[0].google.token = token;
							users[0].google.photoprofile = photoprofile;
							users[0].tokenfirebase = tokenfirebase;
							users[0].google.temp_password = code;
							users[0].google.temp_password_time = new Date();
							users[0].google.status_code = "0";
							users[0].save();
							speedsms.sendsms(phone,"Dùng " + random + " để xác minh tài khoản Thuê Tốt của bạn!", "", "", 1);
							resolve({
								status: 202,
								message: "Check code !"
							});
						}

					}
					else {


						newUser = new user({
							name: name,
							email: email,
							hashed_password: "",
							phone: phone,
							totalreferralpoint : 20000,
							photoprofile: photoprofile,
							tokenfirebase: tokenfirebase,
							created_at: new Date(),
							status_code: "0",
							google: {
								id: id,
								token: token,
								name: name,
								email: email,
								photoprofile: photoprofile,
								temp_password: code,
								temp_password_time: new Date(),
								status_code: "0"
							}
						});

						newUser.save();
						speedsms.sendsms(phone,"Dùng " + random + " để xác minh tài khoản Thuê Tốt của bạn!", "", "", 1);
						resolve({
							status: 202,
							message: "Check code !"
						});
					}
				})
				.catch(err => {
					console.log(err.message);
					reject({status: 500, message: err.message});
				});


		}
		else {
			user.find({phone: phone}, {listproduct: 0, listsavedproduct: 0})

				.then(users => {

					if (users.length != 0) {
						if (users[0].status_code === "1") {
							reject({
								status: 409,
								message: "Da Ton Tai"

							});
						}
						else {
							users[0].name = name;
							users[0].email = email;
							users[0].photoprofile = "no_avatar.png";
							users[0].created_at = new Date();
							users[0].status_code = "0";
							users[0].hashed_password = undefined;
							users[0].tokenfirebase = tokenfirebase;
							users[0].temp_password = code;
							users[0].temp_password_time = new Date();
							users[0].status_code = "0";
							users[0].save();
							speedsms.sendsms(phone,"Dùng " + random + " để xác minh tài khoản Thuê Tốt của bạn!", "", "", 1);
							resolve({
								status: 202,
								message: "Check code !"
							});
						}
					}
					else {
						const hash = bcrypt.hashSync(password, salt);
						newUser = new user({
							name: name,
							email: email,
							totalreferralpoint : 20000,
							photoprofile: "no_avatar.png",
							phone: phone,
							hashed_password: undefined,
							tokenfirebase: tokenfirebase,
							created_at: new Date(),
							temp_password: code,
							temp_password_time: new Date(),
							status_code: "0"

						});
						newUser.save();
						console.log("CODEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE: " + email + " : ",random );
						 // speedsms.sendsms(phone, "Chào bạn! Bạn đã được đăng ký tài khoản tại THUÊ TỐT bằng số điện thoại của bạn. Bạn có thể tải ngay THUÊ TỐT và đăng tin cho thuê miễn phí. Truy cập http://thuetot.vn/ để biết thêm chi tiết.", "", "", 1);
						resolve({
							status: 202,
							message: random
						});
					}
				})
				.catch(err => {
					console.log(err.message);
					reject({status: 500, message: err.message});
				});
		}

	});
exports.registerFinish = (phone, code, type, token) =>
	new Promise((resolve, reject) => {

		user.find({phone: phone}, {listproduct: 0, listsavedproduct: 0})

			.then(users => {
				let diff;

				if (type === 0) {
					diff = new Date() - new Date(users[0].temp_password_time);
				}
				else if (type === 1) {

					diff = new Date() - new Date(users[0].facebook.temp_password_time);
				}
				else {
					diff = new Date() - new Date(users[0].google.temp_password_time);
				}
				const seconds = Math.floor(diff / 1000);


				if (seconds < 300) {
					return users[0];
				} else {
					reject({status: 405, message: "Time Out ! Try again"});
				}
			}).then(usertemp => {

			if (type === 0) {
				if (bcrypt.compareSync(code, usertemp.temp_password)) {
					usertemp.tokenfirebase = token;
					usertemp.temp_password = undefined;
					usertemp.temp_password_time = undefined;
					usertemp.status_code = "1";
					return usertemp.save();
				} else {

					reject({status: 401, message: "Invalid Code !"});
				}
			}
			else if (type === 1) {

				if (bcrypt.compareSync(code, usertemp.facebook.temp_password)) {

					usertemp.facebook.temp_password = undefined;
					usertemp.facebook.temp_password_time = undefined;
					usertemp.facebook.status_code = "1";
					usertemp.status_code = "1";
					return usertemp.save();
				} else {

					reject({status: 401, message: "Invalid Code !"});
				}
			}
			else {
				if (bcrypt.compareSync(code, usertemp.google.temp_password)) {

					usertemp.google.temp_password = undefined;
					usertemp.google.temp_password_time = undefined;
					usertemp.google.status_code = "1";
					usertemp.status_code = "1";
					return usertemp.save();
				} else {

					reject({status: 401, message: "Invalid Code !"});
				}
			}
		})

			.then(usertemp => resolve({status: 200, message: "Register Successfully !", user: usertemp}))

			.catch(err => {
				console.log(err.message);
				reject({status: 500, message: err.message});
			});

	});