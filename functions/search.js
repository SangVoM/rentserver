'use strict';

const product = new require('../models/product');
const bcrypt = new require('bcryptjs');

exports.mSearch2 = (keySearch,location, category,typeArrange) =>

	new Promise((resolve,reject) => {
		var regexLocation = [];
		var regexCategory = [];
		keySearch = new RegExp(keySearch.toLowerCase(), "i");
		let arrLoca = location.split(" , ");
		if(arrLoca)
		{
			for (var i = 0; i < arrLoca.length; i++) {
				regexLocation[i] = new RegExp(arrLoca[i].toLowerCase(), "i");
			}
		}else{
			regexLocation.push(location);
		}
		console.log("arrLoca = " +  regexLocation);
		let arrCate = category.split(" , ");
		if(arrCate)
		{
			for (var i = 0; i < arrCate.length; i++) {
				regexCategory[i] = new RegExp(arrCate[i].toLowerCase(), "i");
			}
		}else{
			regexCategory.push(category);
		}
		console.log("arrCate = " +  regexCategory);

		if(typeArrange === 0)
		{
			product.find( {productname: {$regex: keySearch },"location.address": {$in: regexLocation} , "category": {$in: regexCategory}},{comment: 0}).sort({created_at: -1})
				.populate({path: "user", select : "-listproduct -listsavedproduct"})
				.then(products => {
					//.log("products = " +  category);
					if (products.length === 0) {
						reject({status: 404, message: "Product Not Found !"});

					} else {
						//console.log("products = " + products);
						return products;

					}
				})
				.then(product => {
					resolve({status: 200, listproduct: product});

				})
				.catch(err => reject({status: 500, message: "Internal Server Error !"}));
		}
		if(typeArrange=== 1)
		{
			product.find( {productname: {$regex: keySearch },"location.address": {$in: regexLocation} , "category": {$in: regexCategory}},{comment: 0}).sort({view: -1})
				.populate({path: "user", select : "-listproduct -listsavedproduct"})
				.then(products => {
					///console.log("products = " +  category);
					if (products.length === 0) {
						reject({status: 404, message: "Product Not Found !"});

					} else {
					//	console.log("products = " + products);
						return products;

					}
				})
				.then(product => {
					resolve({status: 200, listproduct: product});

				})
				.catch(err => reject({status: 500, message: "Internal Server Error !"}));
		}
		if(typeArrange=== 2)
		{
			product.find( {productname: {$regex: keySearch },"location.address": {$in: regexLocation} , "category": {$in: regexCategory}},{comment: 0}).sort({price: 1})
				.populate({path: "user", select : "-listproduct -listsavedproduct"})
				.then(products => {
					//console.log("products = " +  category);
					if (products.length === 0) {
						reject({status: 404, message: "Product Not Found !"});

					} else {
						//console.log("products = " + products);
						return products;

					}
				})
				.then(product => {
					resolve({status: 200, listproduct: product});

				})
				.catch(err => reject({status: 500, message: "Internal Server Error !"}));
		}
		if(typeArrange=== 3)
		{
			product.find( {productname: {$regex: keySearch },"location.address": {$in: regexLocation} , "category": {$in: regexCategory}},{comment: 0}).sort({price: -1})
				.populate({path: "user", select : "-listproduct -listsavedproduct"})
				.then(products => {
					//console.log("products = " +  category);
					if (products.length === 0) {
						reject({status: 404, message: "Product Not Found !"});

					} else {
						//console.log("products = " + products);
						return products;

					}
				})
				.then(product => {
					resolve({status: 200, listproduct: product});

				})
				.catch(err => reject({status: 500, message: "Internal Server Error !"}));
		}

	});
exports.mSearchMore = (keySearch,location, category,typeArrange,page) =>

	new Promise((resolve,reject) => {
		const limit = 20;
		if (page.is)
			if (page < 1) page = 1;
		const start = (limit * page) - limit;
		var regexLocation = [];
		var regexCategory = [];
		keySearch = new RegExp(keySearch.toLowerCase(), "i");
		let arrLoca = location.split(" , ");
		if(arrLoca)
		{
			for (var i = 0; i < arrLoca.length; i++) {
				regexLocation[i] = new RegExp(arrLoca[i].toLowerCase(), "i");
			}
		}else{
			regexLocation.push(location);
		}
		console.log("arrLoca = " +  regexLocation);
		let arrCate = category.split(" , ");
		if(arrCate)
		{
			for (var i = 0; i < arrCate.length; i++) {
				regexCategory[i] = new RegExp(arrCate[i].toLowerCase(), "i");
			}
		}else{
			regexCategory.push(category);
		}
		console.log("arrCate = " +  regexCategory);

		if(typeArrange === 0)
		{
			product.find( {productname: {$regex: keySearch },"location.address": {$in: regexLocation} , "category": {$in: regexCategory}},{comment: 0}).skip(start).limit(limit).sort({created_at: -1})
				.populate({path: "user", select : "-listproduct -listsavedproduct"})
				.then(products => {
					//.log("products = " +  category);
					if (products.length === 0) {
						reject({status: 404, message: "Product Not Found !"});

					} else {
						//console.log("products = " + products);
						return products;

					}
				})
				.then(product => {
					resolve({status: 200, listproduct: product});

				})
				.catch(err => reject({status: 500, message: "Internal Server Error !"}));
		}
		if(typeArrange=== 1)
		{
			product.find( {productname: {$regex: keySearch },"location.address": {$in: regexLocation} , "category": {$in: regexCategory}},{comment: 0}).skip(start).limit(limit).sort({view: -1})
				.populate({path: "user", select : "-listproduct -listsavedproduct"})
				.then(products => {
					///console.log("products = " +  category);
					if (products.length === 0) {
						reject({status: 404, message: "Product Not Found !"});

					} else {
						//	console.log("products = " + products);
						return products;

					}
				})
				.then(product => {
					resolve({status: 200, listproduct: product});

				})
				.catch(err => reject({status: 500, message: "Internal Server Error !"}));
		}
		if(typeArrange=== 2)
		{
			product.find( {productname: {$regex: keySearch },"location.address": {$in: regexLocation} , "category": {$in: regexCategory}},{comment: 0}).skip(start).limit(limit).sort({price: 1})
				.populate({path: "user", select : "-listproduct -listsavedproduct"})
				.then(products => {
					//console.log("products = " +  category);
					if (products.length === 0) {
						reject({status: 404, message: "Product Not Found !"});

					} else {
						//console.log("products = " + products);
						return products;

					}
				})
				.then(product => {
					resolve({status: 200, listproduct: product});

				})
				.catch(err => reject({status: 500, message: "Internal Server Error !"}));
		}
		if(typeArrange=== 3)
		{
			product.find( {productname: {$regex: keySearch },"location.address": {$in: regexLocation} , "category": {$in: regexCategory}},{comment: 0}).skip(start).limit(limit).sort({price: -1})
				.populate({path: "user", select : "-listproduct -listsavedproduct"})
				.then(products => {
					//console.log("products = " +  category);
					if (products.length === 0) {
						reject({status: 404, message: "Product Not Found !"});

					} else {
						//console.log("products = " + products);
						return products;

					}
				})
				.then(product => {
					resolve({status: 200, listproduct: product});

				})
				.catch(err => reject({status: 500, message: "Internal Server Error !"}));
		}

	});
// /*exports.mSearch = (searchkey,location, category,typeArrange) =>
//
// 	new Promise((resolve,reject) => {
// 		var regex = new RegExp(searchkey.toLowerCase(), "i")
// 		if(typeArrange===0)
// 		{
// 			//console.log("products = " + regex);
// 			product.find( {productname: {  $regex :   regex   }, address : { $regex: location },category: { $regex: category } } ,{comment: 0}).skip(start).limit(limit).sort({view: -1})
// 				.populate("user")
// 				.then(products => {
//
// 					if (products.length === 0) {
// 						reject({status: 404, message: "Product Not Found !"});
//
// 					} else {
// 						console.log("products = " + products);
// 						return products;
//
// 					}
// 				})
// 				.then(product => {
// 					resolve({status: 200, listproduct: product});
//
// 				})
// 				.catch(err => reject({status: 500, message: "Internal Server Error !"}));
// 		}
// 		if(typeArrange==1)
// 		{
// 			product.find( {productname: {  $regex :  regex  }, address : { $regex: location },category: { $regex: category } } ,{comment: 0} ).skip(start).limit(limit).sort({created_at: -1})
// 				.populate("user")
// 				.then(products => {
//
// 					if (products.length === 0) {
//
// 						reject({status: 404, message: "Product Not Found !"});
//
// 					} else {
// 						console.log("products = " + products);
// 						return products;
//
// 					}
// 				})
// 				.then(product => {
// 					resolve({status: 200, listproduct: product});
//
// 				})
// 				.catch(err => reject({status: 500, message: "Internal Server Error !"}));
// 		}
// 		if(typeArrange==2)
// 		{
// 			product.find( {productname: {  $regex :  regex  }, address : { $regex: location },category: { $regex: category } } ,{comment: 0} ).skip(start).limit(limit).sort({price: 1})
// 				.populate("user")
// 				.then(products => {
//
// 					if (products.length === 0) {
// 						console.log("products = " + products);
// 						reject({status: 404, message: "Product Not Found !"});
//
// 					} else {
//
// 						return products;
//
// 					}
// 				})
// 				.then(product => {
// 					resolve({status: 200, listproduct: product});
//
// 				})
// 				.catch(err => reject({status: 500, message: "Internal Server Error !"}));
// 		}
// 		if(typeArrange==3)
// 		{
// 			product.find( {productname: {  $regex :  regex  }, address : { $regex: location },category: { $regex: category } }  ,{comment: 0} ).skip(start).limit(limit).sort({price: -1})
// 				.populate("user")
// 				.then(products => {
//
// 					if (products.length === 0) {
//
// 						reject({status: 404, message: "Product Not Found !"});
//
// 					} else {
//
// 						return products;
//
// 					}
// 				})
// 				.then(product => {
// 					resolve({status: 200, listproduct: product});
//
// 				})
// 				.catch(err => reject({status: 500, message: "Internal Server Error !"}));
// 		}
//
// 	});
//