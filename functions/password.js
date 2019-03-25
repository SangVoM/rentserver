'use strict';
 
const user = new require('../models/user');
const bcrypt = new require('bcryptjs');
const nodemailer = new require('nodemailer');
const randomstring = new require("randomstring");
const config = new require('../config/config.json');
const speedsms = new require("../functions/speedsms");
const ObjectId = require("mongodb").ObjectID;

exports.changePassword = (userid, password, newPassword) =>
 
    new Promise((resolve, reject) => {

        user.find({ _id: Object(userid) },{listsavedproduct : 0, listproduct :0})
 
        .then(users => {

            let user = users[0];
            const hashed_password = user.hashed_password;
            if(password === ""){
				const salt = bcrypt.genSaltSync(10);
				user.hashed_password = bcrypt.hashSync(newPassword, salt);
				user.status_code = "1";
				return user.save();
			} else
            {
            if (bcrypt.compareSync(password, hashed_password)) {

                const salt = bcrypt.genSaltSync(10);
                user.hashed_password = bcrypt.hashSync(newPassword, salt);

                return user.save();

            } else {

                reject({ status: 401, message: 'Invalid Old Password !' });
            }
			}
			console.log(users)
        })

        .then(user => resolve({ status: 200, message: 'Password Updated Sucessfully !', user : user }))
 
        .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));
 
    });
 
exports.resetPasswordInit = phone =>
    new Promise((resolve, reject) => {
		console.log("Init");
		const random = randomstring.generate({
			length : 6,
			charset : 'numeric'
		});
        user.find({ phone: phone })
 
        .then(users => {
 
            if (users.length === 0) {
 
                reject({ status: 404, message: 'User Not Found !' });
 
            } else {
 
                let user = users[0];
 
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(random, salt);
 
                user.temp_password = hash;
                user.temp_password_time = new Date();
 
                return user.save();
            }
        })
 
        .then(user => {
			speedsms.sendsms(user.phone, random, "", "", 1);
		})
 
        .then(info => {
 
            console.log(info);
            resolve({ status: 200, message: 'Check phone for instructions' })
        })
 
        .catch(err => {
 
            console.log(err);
            reject({ status: 500, message: 'Internal Server Error !' });
 
        });
    });
 
exports.resetPasswordFinish = (phone, code, newPassword) =>
    new Promise((resolve, reject) => {
		console.log("Finish");

		user.find({ phone: phone })
 
        .then(users => {
 
            let user = users[0];
 
            const diff = new Date() - new Date(user.temp_password_time); 
            const seconds = Math.floor(diff / 1000);
            console.log(`Seconds : ${seconds}`);
 
            if (seconds < 300) { return user; } else { reject({ status: 401, message: 'Time Out ! Try again' }); } })
            .then(user => {
 
            if (bcrypt.compareSync(code, user.temp_password)) {
 
                const salt = bcrypt.genSaltSync(10);
				user.hashed_password = bcrypt.hashSync(newPassword, salt);
                user.temp_password = undefined;
                user.temp_password_time = undefined;
 
                return user.save();
 
            } else {
 
                reject({ status: 401, message: 'Invalid Code !' });
            }
        })
 
        .then(user => resolve({ status: 200, message: 'Password Changed Successfully !' }))
 
        .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));
 
    });