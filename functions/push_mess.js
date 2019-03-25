'use strict';
const FCM = require("fcm-node");

const fcm = new FCM("AIzaSyDbZnEq9-lpTvAk41v_fSe_ijKRIIj6R6Y");
exports.push_mess = (msg,deviceId) =>

    new Promise((resolve, reject) => {
		const m = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
			registration_ids: deviceId,

			data: {
				message: msg
			}
		};
		console.log(msg);

		fcm.send(m, function(err, response){
			if (err) {
				console.log(err);
				reject({status: 409, message: 'Error !'});
			} else {
				console.log(response);
				resolve({status: 201, message: 'User Registered Sucessfully !',response : response});

			}
		});


    });

exports.push_messtotopic = (msg) =>

	new Promise((resolve, reject) => {
		const m = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
			to: '/topics/599a9614d8c93b200903e1ab',

			data: {
				message: msg
			}
		};
		console.log(msg);

		fcm.send(m, function(err, response){
			if (err) {
				console.log(err);
				reject({status: 409, message: 'Error !'});
			} else {
				console.log(response);
				resolve({status: 201, message: 'User Registered Sucessfully !',response : response});

			}
		});


	});