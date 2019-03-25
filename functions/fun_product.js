"use strict";

const product = new require("../models/product");
const comment = new require("../models/comment");
const replycomment = new require("../models/replycomment");
const user = new require("../models/user");
const saveProduct = new require("../models/ProductSave");
const ObjectId = require("mongodb").ObjectID;
const FCM = require("fcm-node");
const fcm = new FCM("AIzaSyDbZnEq9-lpTvAk41v_fSe_ijKRIIj6R6Y");



const chat = new require("../models/chat_messager");
exports.allproduct = (type, page, category) =>
	new Promise((resolve, reject) => {
		const d = new Date();
		const timeStamp = d.getTime();
		const limit = 10;
		if (page.is)
			if (page < 1) page = 1;
		const start = (limit * page) - limit;
		console.log("TIMESTAMP: " + timeStamp);


		if (type === 1) {
			if (category === 999) {
				product.find({}, {comment: 0}).sort({"created_at": -1}).skip(start).limit(limit)
					.populate({path: "user", select: "-listproduct -listsavedproduct"})
					.then(products => {

						if (products.length === 0) {

							reject({status: 404, message: "Product Not Found !"});

						} else {
							return products;

						}
					})

					.then(product => {
						resolve({status: 200, listproduct: product});

					})

					.catch(err => reject({status: 500, message: "Internal Server Error !"}));
			} else {
				product.find({category: category}, {comment: 0}).sort({"created_at": -1}).skip(start).limit(limit)
					.populate({path: "user", select: "-listproduct -listsavedproduct"})
					.then(products => {

						if (products.length === 0) {

							reject({status: 404, message: "Product Not Found !"});

						} else {

							return products;

						}
					})

					.then(product => {
						resolve({status: 200, listproduct: product});

					})

					.catch(err => reject({status: 500, message: "Internal Server Error !"}));
			}

		} else {
			if (category === 999) {
				product.find({}, {comment: 0}).sort({"created_at": -1})
					.populate({path: "user", select: "-listproduct -listsavedproduct"})
					.then(products => {

						if (products.length === 0) {

							reject({status: 404, message: "Product Not Found !"});

						} else {

							return products;

						}
					})

					.then(product => {
						resolve({status: 200, listproduct: product});

					})

					.catch(err => reject({status: 500, message: "Internal Server Error !"}));
			} else {
				product.find({category: category}, {comment: 0}).sort({"created_at": -1})
					.populate({path: "user", select: "-listproduct -listsavedproduct"})
					.then(products => {

						if (products.length === 0) {

							reject({status: 404, message: "Product Not Found !"});

						} else {

							return products;

						}
					})

					.then(product => {
						resolve({status: 200, listproduct: product});

					})

					.catch(err => reject({status: 500, message: "Internal Server Error !"}));
			}
		}


	});
exports.allproductlikenew = (category) =>
	new Promise((resolve, reject) => {
		var max = 0;

		product.find({category: category},{comment: 0}, function (err, count) {
			console.log(count.length);
			max = Math.round((count.length)/2);
			var random = Math.round(Math.random() * (max - 0) + 0);
			console.log(max,random);
			product.find({category: category}, {comment: 0}).limit(3).skip(max - random)
				.populate({path: "user", select: "-listproduct -listsavedproduct"})

				.then(products => {

					if (products.length === 0) {

						reject({status: 404, message: "User Not Found !"});

					} else {

						return products;

					}
				})

				.then(product => {
					resolve({status: 200, listproduct: product});

				})

				.catch(err => reject({status: 500, message: "Internal Server Error !"}));
		});




	});
exports.allproductsaved = (type, page, userid) =>
	new Promise((resolve, reject) => {
		const limit = 10;
		if (page.is)
			if (page < 1) page = 1;
		const start = (limit * page) - limit;


		user.findById(userid, {listsavedproduct: 1, _id: 0}).skip(start).limit(limit)
			.populate({
				path: "listsavedproduct user",
				select: "-comment",
				// Get friends of friends - populate the 'friends' array for every friend
				populate: {path: "user", select: "-listproduct -listsavedproduct"}
			})
			.then(products => {

				if (products.length === 0) {

					reject({status: 404, message: "User Not Found !"});

				} else {

					return products;

				}
			})

			.then(product => {
				resolve({status: 200, product: product});

			})

			.catch(err => reject({status: 500, message: "Internal Server Error !"}));


	});

exports.mUpView = () =>

	new Promise((resolve, reject) => {

		product.find({})
			.then(result => {
				if (result.length > 0) {
					for(var i = 0 ; i < result.length;i++){
						var rows = result[i];
						var mView =	rows.view;
						var random = Math.round(Math.random() * (5 - 0) + 0);
						rows.view = mView + random;
						rows.save();
					}
					resolve({status: 201, message: "UpView Success With Number: "+random });

				} else {
					reject({status: 404, message: "Product Not Found !"});
				}


			})

			.catch(err => reject({status: 500, message: "Internal Server Error !"}));

	});

exports.mInboxChat = (userid) =>

	new Promise((resolve, reject) => {

		chat.find({$or: [{userfrom: ObjectId(userid)}, {userto: ObjectId(userid)}]})
			.populate({path: "userfrom userto", select: "_id name email photoprofile"})
			.then(room => {
				if (room.length > 0) {
					resolve({listinbox: room});
				} else {
					resolve({status: 201, listinbox: room});
				}


			})

			.catch(err => reject({status: 500, message: "Internal Server Error !"}));

	});
exports.allproductbyuser = (userid) =>

	new Promise((resolve, reject) => {

		product.find({user: ObjectId(userid)}, {comment: 0, user: 0})

			.then(product => {
				resolve({listproduct: product});

			})

			.catch(err => reject({status: 500, message: "Internal Server Error !"}));

	});
exports.mAndroidId = (androidid,userid) =>

	new Promise((resolve, reject) => {

		user.find({_id: ObjectId(userid)})

			.then(users => {
				if(users.length != 0){
					if(users[0].AndroidId == "" || users[0].AndroidId == undefined){
						users[0].AndroidId = androidid;
						users[0].save();
						reject({status: 200, message: "Add Success ID Device !"});
					}else{
						if(androidid === users[0].AndroidId ){
							reject({status: 200, message: "Success !"});
						}else{
							reject({status: 202, message: "Not Device !"});
						}
					}
				}else{
					reject({status: 404, message: "Not Found User !"});
				}


			})
			.catch(err => reject({status: 500, message: err.message}));

	});
exports.push_notification_chat = (idsend, idrec, userfrom, msg, userto) =>

	new Promise((resolve, reject) => {
		let tokencode;
		user.find({_id: ObjectId(idsend)}, function (err, result) {
			if (err) {
				throw err;
			} else {
				const mResult = result[0];
				const usersend = mResult.name;
				const avata = mResult.photoprofile;
				console.log("idrec: " + idrec);
				user.find({_id: ObjectId(idrec)}, function (err, UserResult) {
					if (err) {
						throw err;
					} else {
						if (UserResult) {
							const mResultUser = UserResult[0];
							tokencode = mResultUser.tokenfirebase;
							console.log("tokencode: " + tokencode);
							if (tokencode) {
								const m = {
									to: tokencode,

									data: {
										idsend : idsend,
										userto: userto,
										name: usersend,
										messager: msg,
										avata: avata,
										userfrom: userfrom
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
						}
					}
				});

				/*	user.find({_id: ObjectId(userfrom)}, function (err, UserResult) {
						if (err) {
							throw err;
						}else{
							if(UserResult){
								var mResultUser = UserResult[0];
								usersend = mResultUser.name;
								avata    = mResultUser.photoprofile;
								console.log(usersend,avata);

							}
							var mResult = result[0];
							tokencode = mResult.tokenfirebase;
							console.log(tokencode,usersend,avata);
							if (tokencode) {
								const m = {
									to: tokencode,

									data: {
										userto: userto,
										name: usersend,
										messager: msg,
										avata: avata,
										userfrom: userfrom
									}
								};
								console.log("push mess: " + msg);

								fcm.send(m, function (err, response) {
									if (err) {
										console.log(err);
										reject({status: 409, message: "MessToTopic Error !"});
									} else {
										console.log(response);
										resolve({status: 201, message: "MessToTopic Sucessfully !", response: response});

									}
								});
							}
						}
					});*/

			}
		});
	});
exports.sendMessChat = (id, userFrom, userTo, email, name, message, socket, io, type) => {

	let photoprofile = "";
	const day = new Date();
	let mResult = true;
	const timestamp = day.getTime();
	let mess = {};
	if (type == 0) {
		// Messager with only text
		mess = {
			email: email,
			name: name,
			photoprofile: "",
			message: message,
			created_at: timestamp
		};

	} else {
		// Messager with only image
		mess = {
			email: email,
			name: name,
			photoprofile: message,
			message: photoprofile,
			created_at: timestamp
		};
		photoprofile = message;
		message = "";
	}

	chat.findOne({userfrom: ObjectId(userFrom), userto: ObjectId(userTo)}, function (err, result) {
		if (err) {

			mResult = false;
			throw err;
		} else {
			if (result) {
				if (result.length === 0) {
					let chatroom = new chat({
						userfrom: userFrom,
						userto: userTo,
						messages: mess
					});
					chatroom.save();
					console.log("fist create2");
				} else {
					chat.findByIdAndUpdate(
						result._id,
						{$push: {"messages": mess}},
						{safe: true, upsert: true, new: true},
						function (err) {
							console.log(err);
						}
					);
					console.log("second create");

				}

			} else {
				let chatroom = new chat({
					userfrom: userFrom,
					userto: userTo,
					messages: mess
				});
				chatroom.save();
				console.log("fist create");

			}
			io.to(userFrom + " - " + userTo).emit("sendchat", userFrom, userTo, email, name, message, photoprofile,timestamp);
			//socket.broadcast.emit('sendchat: '+userFrom+" - "+userTo,userFrom,userTo,email, name,message,photoprofile);
			//socket.emit('sendchat: '+userFrom+" - "+userTo,userFrom,userTo,email, name,message,photoprofile);
		}
	});
	return mResult;

};

exports.roomSockets = (roomId, io) => {
	console.log(roomId);
	const clients = io.sockets.adapter.rooms[roomId];
	console.log(clients.length);
	return clients.length;
};
exports.checkRoomChat = (userFrom, userTo, userIdOnline, socket, type, io, page) => {
	console.log(userFrom, userTo);
	let mResult;
	const limit = 10;
	if (page.is)
		if (page < 1) page = 1;
	const start = -(limit * page);

	let id = "";
	if (userIdOnline === userFrom) {
		id = userTo;
	} else {
		id = userFrom;
	}


	chat.find({userfrom: ObjectId(userFrom), userto: ObjectId(userTo)}, {messages: {$slice: [start, 10]}})
		.populate({path: "userfrom userto", select: "-listproduct -listsavedproduct"}).exec(
		function (err, result) {

			if (err) {

				mResult = null;
				io.to(userFrom + " - " + userTo).emit("getDataMessage", [], type, []);
				throw err;
			} else {
				if (result) {
					if (result.length === 0) {
						mResult = null;
						user.find({_id: ObjectId(id)}, function (err, UserResult) {
							if (err) {
								throw err;
							} else {
								if (UserResult) {
									//	io.to(userFrom+" - "+userTo).emit("getDataMessage", [],type,UserResult);
									socket.emit("getDataMessage", [], type, UserResult);
								}
							}
						});

					} else {
						mResult = result;
						user.find({_id: ObjectId(id)}, function (err, UserResult) {
							if (err) {
								throw err;
							} else {
								if (UserResult) {
									//io.to(userFrom+" - "+userTo).emit("getDataMessage", mResult,type,UserResult);
									socket.emit("getDataMessage", mResult, type, UserResult);
								}
							}
						});
					}
				} else {
					mResult = null;
					user.find({_id: ObjectId(id)}, function (err, UserResult) {
						if (err) {
							throw err;
						} else {
							if (UserResult) {
								//	io.to(userFrom+" - "+userTo).emit("getDataMessage", [],type,UserResult);
								socket.emit("getDataMessage", [], type, UserResult);
							}
						}
					});
				}

			}
		});


};

/*	new Promise((resolve, reject) => {
		let cod = userFrom+" - "+userTo;
		let cdo = userTo+" - "+userFrom;
		console.log(cod,cdo);
		chat.find({$and: [ {roomid: cod} , {roomid: cdo} ]})
			.then(mess => {
				if(mess.length === 0)
				{
					reject({status: 404, message: "User Not Found !"});
				}else{
					return mess;
				}
			})
			.then(mess => {
				resolve({status: 200, message: "111111111"});

			})
			.catch(err => reject({status: 500, message: "Internal Server Error !"}));

	});*/

exports.EditProduct = (productid, productname, price, time, number, category, address, description, status, timestamp, listitem) =>

	new Promise((resolve, reject) => {

		product.find({_id: ObjectId(productid)})
			.then(products => {
				let productss = products[0];
				productss.productname = productname;
				productss.price = price;
				productss.time = time;
				productss.number = number;
				productss.category = category;
				productss.location.address = address;
				productss.description = description;
				productss.status = status;
				productss.timestamp = timestamp;
				if (listitem.length !== 0) {
					for (var i = 0; i <= (listitem.length - 1); i++) {
						console.log(productid + "/" + listitem[i]);
						product.findOneAndUpdate({_id: ObjectId(productid)}, {$pull: {images: listitem[i]}})
							.then(() => {
								resolve({status: 200, message: "Delete Image Success"});
							})
							.catch(err => reject({status: 500, message: "Internal Server Error !"}));
					}
				}

				return productss.save();
			})
			.then(product => {
				resolve({status: 200, message: "Success"});
			})

			.catch(err => reject({status: 500, message: "Internal Server Error !"}));

	});
exports.createproduct = (userid, prodctname, price, time, number, category, address, description, lat, lot, timestamp, type) =>

	new Promise((resolve, reject) => {

		let newproduct;

		console.log(type);
		if (type === 1) {
			console.log(price);
			newproduct = new product({
				user: userid,
				productname: prodctname,
				price: price,
				time: time,
				number: number,
				category: category,
				description: description,
				location: {
					type: "Point",
					address: address,
					coordinates: [lot, lat]
				},
				created_at: timestamp,
				status: "0",
				view: 0,
				type: type
			});
		} else {
			console.log(price);
			newproduct = new product({
				user: userid,
				productname: prodctname,
				price: "",
				time: "",
				number: number,
				category: category,

				description: description,
				location: {
					type: "Point",
					address: address,
					coordinates: [lot, lat]
				},
				created_at: timestamp,
				status: "0",
				view: 0,
				type: type
			});
		}


		newproduct.save()


			.then(() => {
				user.findByIdAndUpdate(
					userid,
					{$push: {"listproduct": newproduct._id}},
					{safe: true, upsert: true, new: true},
					function (err) {
						console.log(err);
						newproduct.populate("user", "_id name email images", function (err) {

							resolve({status: 201, message: "product Registered Sucessfully !", product: newproduct});
						});
					}
				);

			})


			.catch(err => {

				if (err.code === 11000) {


					reject({status: 409, message: "product Already Registered !"});

				} else {
					reject({status: 500, message: "Internal Server Error !"});
					throw err;

				}
			});
	});

exports.saveproduct = (userid, productid, type) =>

	new Promise((resolve, reject) => {
		if (type === "0") {
			user.findByIdAndUpdate(
				userid,
				{$push: {"listsavedproduct": productid}},
				{safe: true, upsert: true, new: true, select: "-listproduct -listsavedproduct"},
				function (err, model) {
					console.log(err);

					resolve({status: 201, message: "product save Successfully !"});

				}
			);
		}
		else {
			user.findByIdAndUpdate(
				userid,
				{$pull: {"listsavedproduct": productid}},
				{safe: true, upsert: true, new: true},
				function (err, model) {
					console.log(err);

					resolve({status: 201, message: "product unsave Successfully !", user: model});

				}
			);
		}
	});
exports.push_messtotopic2 = (commentid, username, userreply, userown, content, msg, token) =>

	new Promise((resolve, reject) => {
		const m = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
			to: "/topics/" + commentid,

			data: {
				commentid: commentid,
				username: username,
				content: content,
				userreply: userreply,
				userown : userown,
				msg: msg
			}
		};
		console.log("push mess: " + msg);
		console.log("push topics: " + commentid);
		fcm.send(m, function (err, response) {
			if (err) {
				console.log(err);
				reject({status: 409, message: "MessToTopic Error !"});
			} else {
				console.log(response);
				resolve({status: 201, message: "MessToTopic Sucessfully !", response: response});

			}
		});


	});
exports.push_messtotopic = (productid, msg, userid) =>

	new Promise((resolve, reject) => {
		const m = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
			to: "/topics/" + productid,

			data: {
				productid: productid,
				useridproduct: msg,
				useridcmt: userid
			}
		};
		console.log("push mess: " + msg);
		console.log("push topics: " + productid);
		fcm.send(m, function (err, response) {
			if (err) {
				console.log(err);
				reject({status: 409, message: "MessToTopic Error !"});
			} else {
				console.log(response);
				resolve({status: 201, message: "MessToTopic Sucessfully !", response: response});

			}
		});


	});
exports.push_messtotoken = (commentid, username, userreply, userown, content, msg, token) =>

	new Promise((resolve, reject) => {
		const m = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
			to: token,

			data: {
				commentid: commentid,
				username: username,
				content: content,
				userreply: userreply,
				userown : userown,
				msg: msg
			}
		};
		console.log("push mess: " +token + " / " + msg);

		fcm.send(m, function (err, response) {
			if (err) {
				console.log(err);
				reject({status: 409, message: "MessToTopic Error !"});
			} else {
				console.log(response);
				resolve({status: 201, message: "MessToTopic Sucessfully !", response: response});

			}
		});


	});
exports.refreshreplycomment = (commentid) =>
	new Promise((resolve, reject) => {
	// ,{comment: 0}
		replycomment.find({comment: ObjectId(commentid)})
			.populate({path : "user comment",
				select : "_id name email photoprofile user content",
				populate : ({path : "user",select : "_id name email photoprofile tokenfirebase"})})
			.then(comment => {
				console.log(comment);
				resolve({comment: comment});

			})

			.catch(err => {

				if (err.code === 11000) {

					reject({status: 409, message: "Comment Already Registered !"});

				} else {
					reject({status: 500, message: "Internal Server Error2 !"});
					throw err;

				}
			});
	});
exports.getComment = (commentid) =>
	new Promise((resolve, reject) => {
//
		comment.find({_id: ObjectId(commentid)})
			.populate({
				path: "user product listreply",
				select: "_id name email photoprofile user content time",
				//	options: {sort: {"time": -1}},
				// Get friends of friends - populate the 'friends' array for every friend
				populate: {path: "user ", select: "_id name email photoprofile "}})

			.then(comment => {
				resolve({comment: comment});

			})

			.catch(err => {

				if (err.code === 11000) {

					reject({status: 409, message: "Comment Already Registered !"});

				} else {
					reject({status: 500, message: "Internal Server Error2 !"});
					throw err;

				}
			});
	});
exports.refreshcomment = (productid) =>
	new Promise((resolve, reject) => {
//
		comment.find({product: ObjectId(productid)})
			.populate({
				path: "user product listreply",
				select: "_id name email photoprofile user content time",
			//	options: {sort: {"time": -1}},
				// Get friends of friends - populate the 'friends' array for every friend
				populate: {path: "user ", select: "_id name email photoprofile "}})

			.then(comment => {
				resolve({comment: comment});

			})

			.catch(err => {

				if (err.code === 11000) {

					reject({status: 409, message: "Comment Already Registered !"});

				} else {
					reject({status: 500, message: "Internal Server Error2 !"});
					throw err;

				}
			});
	});
//108.255696,15.977939  //1609.34 * 1
exports.SearchMap = (keySearch, lat, lng, distance, listCategory) =>

	new Promise((resolve, reject) => {
		var regexCategory = [];
		keySearch = new RegExp(keySearch.toLowerCase(), "i");
		let arrCate = listCategory.split(" , ");
		if (arrCate) {
			for (var i = 0; i < arrCate.length; i++) {
				regexCategory[i] = new RegExp(arrCate[i].toLowerCase(), "i");
			}
		} else {
			regexCategory.push(listCategory);
		}
		console.log("arrCate = " + regexCategory);
		// product.createIndex(
		// 	{point: "2dsphere"}, function(err, result) {
		// 	if(err){
		// 		throw err
		// 	}else{
		// 		console.log(result);
		// 		callback(result);
		// 	}
		// 	});
		console.log(keySearch, lat, lng, distance, listCategory);
		product.find({
			productname: {$regex: keySearch},
			location: {
				$nearSphere: {
					$geometry: {type: "Point", coordinates: [lng, lat]},
					$maxDistance: distance * 1000
				}
			},
			category: {$in: regexCategory}
		}, {comment: 0})
			.populate({path: "user", select: "-listproduct -listsavedproduct"})
			.then(products => {
				console.log("arrCate =23213 ");
				if (products.length === 0) {
					reject({status: 404, message: "Product Not Found !"});

				} else {
					console.log("products = " + products);
					return products;

				}
			})
			.then(product => {
				console.log("arrCate =33333 ");
				resolve({status: 200, listproduct: product});

			})
			.catch(err => {
				console.log(err.message);
				reject({status: 500, message: err.message});
			});
	});

exports.deleteProduct = (productid) =>

	new Promise((resolve, reject) => {
		comment.find({product: productid})
			.then(listcomment => {
				if(listcomment.length > 0){

					for(var i = 0;i<listcomment.length;i++)
					{
						replycomment.deleteMany({comment: listcomment[i]},function (err,offer) {
							if (err) {
								console.log(err);
							}
						});
					}
					comment.deleteMany({product: ObjectId(productid)})

						.then(() => {

							user.update({}, {$pull: {listproduct: ObjectId(productid)}}, {multi: true})
								.then(() => {

									user.update({}, {$pull: {listsavedproduct: ObjectId(productid)}}, {multi: true})
										.then(() => {

											product.findByIdAndRemove(productid, function (err, offer) {
												if (err) {
													console.log(err);
												}
												resolve({status: 200, message: "DELETE OK!"});
											});
										})
										.catch(err => reject({status: 500, message: err.message}));

								})
								.catch(err => reject({status: 500, message: err.message}));
						})
						.catch(err => reject({status: 500, message: err.message}));

				}else{
					user.update({}, {$pull: {listproduct: ObjectId(productid)}}, {multi: true})
						.then(() => {

							user.update({}, {$pull: {listsavedproduct: ObjectId(productid)}}, {multi: true})
								.then(() => {

									product.findByIdAndRemove(productid, function (err, offer) {
										if (err) {
											console.log(err);
										}
										resolve({status: 200, message: "DELETE OK!"});
									});
								})
								.catch(err => reject({status: 500, message: err.message}));

						})
						.catch(err => reject({status: 500, message: err.message}));
				}
			})
			.catch(err => {
				reject({status: 500, message: err.message});
			});

	});
exports.deleteProductDev = (productid) =>

	new Promise((resolve, reject) => {

		comment.find({product: productid})
			.then(listcomment => {
				if(listcomment.length > 0){

					for(var i = 0;i<listcomment.length;i++)
					{
						replycomment.deleteMany({comment: listcomment[i]},function (err,offer) {
							if (err) {
								console.log(err);
							}
						});
					}
					comment.deleteMany({product: ObjectId(productid)})

						.then(() => {

							user.update({}, {$pull: {listproduct: ObjectId(productid)}}, {multi: true})
								.then(() => {

									user.update({}, {$pull: {listsavedproduct: ObjectId(productid)}}, {multi: true})
										.then(() => {
											product.find({_id: ObjectId(productid)})
												.then(products => {
											if(products.images.length > 0){
												resolve({status: 204, message: "CO ANH!"});
											}
										})
										.catch(err => reject({status: 500, message: err.message}));
											product.findByIdAndRemove(productid, function (err, offer) {
												if (err) {
													console.log(err);
												}
												resolve({status: 200, message: "DELETE OK!"});
											});
										})
										.catch(err => reject({status: 500, message: err.message}));

								})
								.catch(err => reject({status: 500, message: err.message}));
						})
						.catch(err => reject({status: 500, message: err.message}));

				}else{
					user.update({}, {$pull: {listproduct: ObjectId(productid)}}, {multi: true})
						.then(() => {

							user.update({}, {$pull: {listsavedproduct: ObjectId(productid)}}, {multi: true})
								.then(() => {

									product.findByIdAndRemove(productid, function (err, offer) {
										if (err) {
											console.log(err);
										}
										resolve({status: 200, message: "DELETE OK!"});
									});
								})
								.catch(err => reject({status: 500, message: err.message}));

						})
						.catch(err => reject({status: 500, message: err.message}));
				}
			})
			.catch(err => {
				reject({status: 500, message: err.message});
			});

	});
exports.mSaveProduct = (userid, productid) =>
	new Promise((resolve, reject) => {

		saveProduct.find({"user": ObjectId(userid)})
			.populate("product")
			// .populate({
			// 	path: "product ProductSave",
			// 	populate: {path: "ProductSave", select: "_id user productid"}
			// })
			.then(sav => {
				console.log("run");
				if (sav.length === 0) {

					const saveProduct2 = new saveProduct({
						productid: productid,
						user: userid
					});
					saveProduct2.save();
					resolve({status: 201, message: "ok"});
				} else {
					const mData = sav[0];
					saveProduct.find({"productid": ObjectId(productid)})
						.then(get => {
							if (get.length === 0) {
								saveProduct.findByIdAndUpdate(mData._id,
									{$push: {"productid": productid}},
									{safe: true, upsert: true, new: true},
									function (err, offer) {
										if (err) {
											throw err;
										}
									}
								);
								resolve({status: 200, message: "Luu thanh cong"});
							} else {
								saveProduct.findByIdAndUpdate(mData._id,
									{$pull: {"productid": productid}},
									{safe: true, upsert: true, new: true},
									function (err, offer) {
										if (err) {
											throw err;
										}
									}
								);
								resolve({status: 201, message: "Huy Luu thanh cong"});
							}

						})
						.catch(err => reject({status: 500, message: "loi may chu noi bo"}));

				}

			})
			// .then(result => resolve({status: 201, message: "ok"})
			// )
			.catch(err => reject({status: 500, message: "loi may chu noi bo"}));
	});
exports.deletecomment = (commentid, productid) =>

	new Promise((resolve, reject) => {
		// console.log("cmtid:" + commentid + " productid: " + productid);
		product.findOneAndUpdate(productid, {$pull: {comment: commentid}})
			.then(() => {
				comment.findByIdAndRemove(commentid, function (err, offer) {
					if (err) {
						throw err;
					}
					module.exports.refreshcomment(productid)

						.then(result => {
							replycomment.deleteMany({comment: ObjectId(commentid)},function (err, offer){
								if (err) {
									throw err;
								}
							});
							resolve({status: 201, comment: result.comment});
						})
						.catch(err => {
							if (err.code === 11000) {

								reject({status: 409, message: "Comment Already Registered !"});

							} else {
								reject({status: 500, message: "Internal Server Error 1!"});
								throw err;

							}
						});


					module.exports.push_messtotopic(productid, "Ahihi", 1);

				});



				// let ObjectId;
				// ObjectId = require("mongodb").ObjectID;
				// comment.find({productid: ObjectId(productid)})
				// 	.populate("user", "_id name photoprofile" )
				// 	.then(comments => {
				//
				// 		if (comments.length === 0) {
				//
				// 			reject({status: 404, message: "Product Not Found !"});
				//
				// 		} else {
				//
				// 			return comments;
				//
				// 		}
				// 	})
				// 	.then(comment => {
				//
				//
				//
				// 	});


			});

	});
exports.deletereplycomment = (replycommentid, commentid) =>

	new Promise((resolve, reject) => {
		// console.log("cmtid:" + commentid + " productid: " + productid);
		comment.findOneAndUpdate(commentid, {$pull: {listreply: replycommentid}})
			.then(() => {
				replycomment.findByIdAndRemove(replycommentid, function (err, offer) {
					if (err) {
						throw err;
					}
					module.exports.refreshreplycomment(commentid)

						.then(result => {

							resolve({status: 201, comment: result.comment});
						})
						.catch(err => {
							if (err.code === 11000) {

								reject({status: 409, message: "Comment Already Registered !"});

							} else {
								reject({status: 500, message: "Internal Server Error 1!"});
								throw err;

							}
						});


					module.exports.push_messtotopic(commentid, "Ahihi", 1);

				});

			});

	});
exports.addcomment = (userid, productid, content, time) =>

	new Promise((resolve, reject) => {

		let newcomment;


		newcomment = new comment({
			user: userid,
			product: productid,
			content: content,
			time: time
		});

		newcomment.save()


			.then(() => {

				product.find({_id: ObjectId(productid)})
					.then(result => {
						if(result.length ==  0){
							comment.findByIdAndRemove(newcomment._id, function (err, offer) {
								if (err) {
									throw err;
								}
							});
							reject({status: 405, message: "Product is not Found !"});
						}else{
							product.findByIdAndUpdate(
								productid,
								{$push: {"comment": newcomment._id}},
								{safe: true, upsert: true, new: true},
								function (err, model) {
									console.log(err);
								}
							);
							module.exports.getComment(newcomment._id)

								.then(result => {
									console.log(result.comment);
									resolve({status: 201, comment: result.comment});
									module.exports.push_messtotopic(productid, result.comment[0].product.user._id, userid);
								})
								.catch(err => {
									if (err.code === 11000) {

										reject({status: 409, message: "Comment Already Registered !"});

									} else {
										reject({status: 500, message: "Internal Server Error 1!"});
										throw err;

									}
								});
						}
					})
					.catch(err => {
						if (err.code === 11000) {

							reject({status: 409, message: "Comment Already Registered !"});

						} else {
							reject({status: 500, message: "Internal Server Error 1!"});
							throw err;

						}
					});



			})

			.catch(err => {

				if (err.code === 11000) {

					reject({status: 409, message: "Comment Already Registered !"});

				} else {
					reject({status: 500, message: "Internal Server Error 1!"});
					throw err;

				}
			});
	});

exports.addreplycomment = (userid, commentid, content, time) =>

	new Promise((resolve, reject) => {

		let newcomment;


		newcomment = new replycomment({
			user: userid,
			comment: commentid,
			content: content,
			time: time
		});

		newcomment.save()


			.then(() => {
				comment.find({_id: commentid}, function (err,model) {
						if(err){
							console.log(err);
						}
						if(model.length != 0 ){
							comment.findByIdAndUpdate(
								commentid,
								{$push: {"listreply": newcomment._id}},
								{safe: true, upsert: true, new: true},
								function (err, model) {
									console.log(err);
								}
							);
							module.exports.refreshreplycomment(commentid)
								.then(result => {
									resolve({status: 201, comment: result.comment});
									//	module.exports.push_messtotoken(result.comment[0].comment._id,result.comment[0].comment.user.name,userid,result.comment[0].comment.user._id,result.comment[0].comment.content,"Có người trả lời bình luận của bạn",result.comment[0].comment.user.tokenfirebase)
									module.exports.push_messtotopic2(result.comment[0].comment._id,result.comment[0].comment.user.name,userid,result.comment[0].comment.user._id,result.comment[0].comment.content,"Có người trả lời bình luận của bạn",result.comment[0].comment.user.tokenfirebase);

								})
								.catch(err => {
									if (err.code === 11000) {
										reject({status: 409, message: "Comment Already Registered !"});

									} else {
										reject({status: 500, message: "Internal Server Error 1!"});
										throw err;

									}
								});
						}else{
							replycomment.findByIdAndRemove(newcomment._id, function (err, offer) {
								if (err) {
									throw err;
								}
							});
							reject({status: 405, message: "Comment was delete!"});
						}

				});



			})

			.catch(err => {

				if (err.code === 11000) {

					reject({status: 409, message: "Comment Already Registered !"});

				} else {
					reject({status: 500, message: "Internal Server Error 1!"});
					throw err;

				}
			});
	});
exports.productdetail = (productid, userid) =>

	new Promise((resolve, reject) => {

		let isSaved;
		product.find({_id: ObjectId(productid)})
			.populate({
				path: "user comment",
				select: "-listproduct -listsavedproduct",
				options: {sort: {"time": -1}},
				// Get friends of friends - populate the 'friends' array for every friend
				populate: {path: "user listreply", select: "_id name email photoprofile user content time",populate : {path : "user",select : "_id name email photoprofile"}}
			})

			.then(products => {
				if (products.length === 0) {

					reject({status: 404, message: "Product Not Found !"});

				} else {
					if (products[0].user._id.toString() !== userid) {
						user.findOne({_id: ObjectId(userid), listsavedproduct: productid}, function (err, save) {
							if (err) isSaved = false;
							isSaved = !!save;
							console.log("trang thai " + isSaved);
							products[0].view = products[0].view + 1;
							// products[0].statussave = isSaved;
							products[0].save();
							resolve({status: 200, product: products[0], statussave: isSaved});
						});
					}
					else {
						resolve({status: 201, product: products[0]});

					}

				}

			})
			.catch(err => reject({status: 500, message: "Internal Server Error !"}));

	});

exports.allcomment = (productid) =>

	new Promise((resolve, reject) => {


		product.find({_id: ObjectId(productid)}, {comment: 1})
			.populate({
				path: "user comment",
				// Get friends of friends - populate the 'friends' array for every friend
				populate: {path: "user", select: "_id name photoprofile"}
			})
			.then(products => {

				if (products.length === 0) {

					reject({status: 404, message: "Product Not Found !"});

				} else {

					return products[0];

				}
			})

			.then(product => {


				resolve({status: 200, product: product});

			})

			.catch(err => reject({status: 500, message: "Internal Server Error !"}));

	});

exports.likecomment = (idcomment,iduserlike,type) =>

	new Promise((resolve, reject) => {
		console.log("type: "+type)
		comment.find({_id: ObjectId(idcomment)})
			.then(commentlist => {

				if (commentlist.length === 0) {

					reject({status: 404, message: "Comment Not Found !"});

				} else {
					if(type === "0"){

						comment.findByIdAndUpdate(
							idcomment,
							{$push: {"listlike": iduserlike}},
							{safe: true, upsert: true, new: true},
							function (err, model) {
								if(err){
									console.log(err);
									resolve({
										status: 500,
										message: "Faile"
									});
								}else{

									resolve({
										status: 202,
										message: "Success"
									});
								}


							}
						);
					}else{

						comment.findByIdAndUpdate(
							idcomment,
							{$pull: {"listlike": iduserlike}},
							{safe: true, upsert: true, new: true},
							function (err, model) {
								if(err){
									console.log(err);
									resolve({
										status: 500,
										message: "Faile"
									});
								}else{

									resolve({
										status: 202,
										message: "Success"
									});
								}


							}
						);
					}
				}
			})

			.catch(err => reject({status: 500, message: err.message}));

	});

exports.uploadproduct = (productid, image) =>

	new Promise((resolve, reject) => {

		console.log(productid);


		product.find({_id: ObjectId(productid)})
			.populate("user")
			.then(products => {

				if (products.length === 0) {

					reject({status: 404, message: "User Not Found !"});

				} else {

					return products[0];

				}
			})

			.then(product => {
				product.images.push(image);
				product.save();
			})
			.catch(err => reject({status: 500, message: "Internal Server Error !"}));

	});
exports.fixcheat = () =>

	new Promise((resolve, reject) => {

		user.find({})
			.then(users => {
				if(users.length >0){
					for(var i=0 ; i<users.length ; i++){
						user.find({referral: {$regex: users[i].phone}},function (err,data){
							if(err){throw err;}
							if(data.length>0){
								console.log("sdt "+ users[i].phone);
								console.log("so nguoi chia se "+data.length);
								var num = (data.length)*5;
								num = num + 20000;
								console.log("tien "+num);
							}
						});
					}
				}
			})


			.catch(err => reject({status: 500, message: "Internal Server Error !"}));

	});
exports.UpImageChat = (userfrom, userto, mEmail, mName, img) =>

	new Promise((resolve, reject) => {
		//	var id = id;
		console.log(mEmail, mName);
		var userFrom = userfrom;
		var userTo = userto;
		var email = mEmail;
		var name = mName;
		var message = "";
		var photoprofile = img;
		const day = new Date();
		var mResult = true;
		const timestamp = day.getTime();
		var mess = {
			email: email,
			name: name,
			message: message,
			photoprofile: photoprofile,
			created_at: timestamp
		};
		chat.findOne({userfrom: ObjectId(userFrom), userto: ObjectId(userTo)})
			.then(chatResult => {
				if (!chatResult) {
					let chatroom = new chat({
						userfrom: userFrom,
						userto: userTo,
						messages: mess
					});
					chatroom.save();
					console.log(chatroom);
					resolve({status: 200, listchat: chatroom});
				} else {

					chat.findByIdAndUpdate(
						chatResult._id,
						{$push: {"messages": mess}},
						{safe: true, upsert: true, new: true},
						function (err, model) {
							console.log(err);
							let mess = model.messages.length;
							mess -= 1;
							console.log(model.messages[mess]);
							console.log({status: 200, chatlist: model.messages[mess]});
							resolve({
								status: 205,
								listchat: model.messages[mess],
								message: model.messages[mess] + "//"
							});
						}
					);

				}
			})
			.catch(err => reject({status: 500, message: "Internal Server Error !"}));

	});
exports.edit_avatar = (userid, image) =>

	new Promise((resolve, reject) => {

		user.findByIdAndUpdate(
			userid,
			{$set: {"photoprofile": image}},
			{safe: true, upsert: true, new: true, select: "-listproduct -listsavedproduct"},
			function (err, model) {
				console.log(err);
				resolve({status: 200, user: model});
			}
		);

	});
exports.addValue = () =>

	new Promise((resolve, reject) => {
		user.find({},
			function (err, model) {
				if(err){console.log(err);}
				if(model.length>0){
					for(var i = 0 ; i< model.length; i++){
						if(model[i].totalreferralpoint == "" || model[i].totalreferralpoint == null){
							console.log(model[i].name);
						//	var add = model[i];
							model[i].totalreferralpoint = 20000;
							model[i].save();
						}
					}
				}
				resolve({status: 200, user: model});
			}
		);

	});