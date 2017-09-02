/*
Author: Aishwarya Arthanari Eswaran
Andrew ID: aarthana
*/

const express = require('express');
const app = express();
var session = require('express-session');
var redis = require('redis');
var redisStore = require('connect-redis')(session);
var cookieParser = require('cookie-parser');
const mysql = require('mysql');

var client = redis.createClient(6379, 'mynewrc.uyzlg9.0001.use1.cache.amazonaws.com', {no_ready_check: true});

//connection to database
const mc = mysql.createConnection({
	host: 'aishwarya-mysql.c72b0uwdjqt4.us-east-1.rds.amazonaws.com', //aishwarya-mysql.c72b0uwdjqt4.us-east-1.rds.amazonaws.com
	port: '3306',
	user: 'aish_master', //aish_master
	password: 'Aishkavin2',  //Aishkavin2
	database: 'project2_db'  //project2_db
});
mc.connect();
console.log('Connection to database successful!');

//session maintenance
app.use(cookieParser());
app.use(session({
	secret: "cd245kjbl89_secretSecretString",
	store: new redisStore({host: 'mynewrc.uyzlg9.0001.use1.cache.amazonaws.com', port: 6379, client: client, ttl: 260}),
	resave: true,
	rolling: true,
	saveUninitialized: false,
	cookie: {
		expires: 15 * 60 * 1000
	}
}));

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended : true
}));

//register users functionality
app.post('/registerUser', function(req, res) {
	var fname = req.body.fname;
	var lname = req.body.lname;
	var address = req.body.address;
	var city = req.body.city;
	var state = req.body.state;	
	var zip = req.body.zip; 
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var is_admin = 'No';
	
	if((!fname) || (!lname) || (!address) || (!city) || (!state) || (!zip) || (!email) || (!username) || (!password)) {
		return res.status(200).send({message: 'The input you provided is not valid'});
	}
	
	mc.query('INSERT INTO users VALUES (?,?,?,?,?,?,?,?,?,?)', [fname,lname,address,city,state,zip,email,username,password,is_admin], function (error,results,fields) {
		if(error) {
			return res.status(200).send({message: 'The input you provided is not valid'});
		}
		var msg = fname + " was registered successfully";
		return res.send({message: msg});
	});
});

//login functionality
app.post('/login', function (req, res) {
	
	var username = req.body.username;
	var password = req.body.password;
	if(!username) {
		return res.status(200).send({error: true, message: 'Please provide your username.'});
	}
	if(!password) {
		return res.status(200).send({error: true, message: 'Please provide your password.'});
	}
	mc.query('SELECT * FROM users WHERE username=? and password=?', [username,password], function (error, results, fields) {
			if(error) {
				res.send({message: 'SQL error'});
			}
			if(results.length <= 0) {
				return res.status(200).send({message: 'There seems to be an issue with the username/password combination that you entered'});
			}
		var fname = results[0].fname;
		req.session.user = username;
		var msg = "Welcome " + fname;
		return res.send({message: msg});
	});
});

//logout functionality
app.post('/logout', function (req,res) {
	if(req.session && req.session.user) {
			req.session.destroy();
			return res.send({message: "You have been successfully logged out"});
	}
	else {
		return res.send({message: "You are not currently logged in"});
	}
});

//update info functionality
app.post('/updateInfo', function(req, res) {
	if(req.session && req.session.user) {
		var old_username = req.session.user;
		var new_fname = req.body.fname;
		var new_lname = req.body.lname;
		var new_address = req.body.address;
		var new_city = req.body.city;
		var new_state = req.body.state;	
		var new_zip = req.body.zip; 
		var new_email = req.body.email;
		var new_username = req.body.username; 
		var new_password = req.body.password;
		mc.query('SELECT * from users where username=?',[old_username], function(error,results,fields) {
			if(error) {
				res.send({message: 'SQL error'});
			}
			if(new_fname) {
				results[0].fname = new_fname;
			}
			if(new_lname) {
				results[0].lname = new_lname;
			}
			if(new_address) {
				results[0].address = new_address;
			}
			if(new_city) {
				results[0].city = new_city;
			}
			if(new_state) {
				results[0].state = new_state;
			}
			if(new_zip) {
				results[0].zip = new_zip;
			}
			if(new_email) {
				results[0].email = new_email;
			}
			if(new_password) {
				results[0].password = new_password;
			}
			if(new_username) {
				results[0].username = new_username;
			}
			var f = results[0].fname;
			var l = results[0].lname;
			var ad = results[0].address;
			var c = results[0].city;
			var s = results[0].state;
			var z = results[0].zip;
			var e = results[0].email;
			var u = results[0].username;
			var p = results[0].password;
			mc.query('UPDATE users SET fname=?, lname=?, address=?, city=?, state=?, zip=?, email=?, username=?, password=? WHERE username=?', [f,l,ad,c,s,z,e,u,p,old_username], function(error,results,fields) {
				if(error) {
					return res.send({message: 'The input you provided is not valid'});
				}
				req.session.user = u;
				var msg = f + " your information was successfully updated";
				return res.send({message: msg});
			});
		});
	}
	else {
		return res.send({message: "You are not currently logged in"});
	}
});

//add products functionality - must be logged in as admin
app.post('/addProducts', function(req, res) {
	if(req.session && req.session.user) {
		var username = req.session.user;
		mc.query('SELECT * from users where username=?', [username], function(error, results, fields) {
			if(error) {
				res.send({message: 'SQL error'});
			}
			if(results[0].is_admin == "Yes") {
				var asin = req.body.asin;
				var productName = req.body.productName;
				var productDescription = req.body.productDescription;
				var group = req.body.group;
				
				if((!asin) || (!productName) || (!productDescription) || (!group)) {
						return res.status(200).send({message: 'The input you provided is not valid'});
				}
				mc.query('INSERT into products values (?,?,?,?)',[asin,productName,productDescription,group],function(error,results,fields){
					if(error){
						return res.send({message: 'The input you provided is not valid'});
					}
					mc.query('INSERT into products_read values (?,?,?,?)',[asin,productName,productDescription,group],function(error,results,fields) {
						if(error) {
							return res.send({message: 'The input you provided is not valid'});
						}
						console.log("added product to other product table also successfully");
					});
					var msg = productName + " was successfully added to the system";
					return res.send({message: msg});
				});				
			}
			else {
				return res.send({message: 'You must be an admin to perform this action'});
			}
		});
	}
	else {
		return res.send({message: "You are not currently logged in"});
	}
});

//modify products functionality
app.post('/modifyProduct', function(req,res) {
	if(req.session && req.session.user) {
		var username = req.session.user;
		mc.query('SELECT * from users where username=?', [username], function(error, results, fields) {
			if(error) {
				res.send({message: 'SQL error'});
			}
			if(results[0].is_admin == "Yes") {
				var asin = req.body.asin;
				var productName = req.body.productName;
				var productDescription = req.body.productDescription;
				var group = req.body.group;
				
				if((!asin) || (!productName) || (!productDescription) || (!group)) {
						return res.status(200).send({message: 'The input you provided is not valid'});
				}
				mc.query('SELECT * FROM products where asin=?',[asin], function(error,results,fields) {
					if(error || results.length <= 0) {
						return res.send({message: 'The input you provided is not valid'});
					}
					mc.query('UPDATE products SET productName=?, productDescription=?, groups=? WHERE asin=?',[productName,productDescription,group,asin],function(error,results,fields){
						if(error){
							return res.send({message: 'The input you provided is not valid'});
						}
						mc.query('UPDATE products_read SET productName=?, productDescription=?, groups=? WHERE asin=?',[productName,productDescription,group,asin],function(error,results,fields) {
							if(error) {
								return res.send({message: 'The input you provided is not valid'});
							}
							console.log("modified product to other product table also successfully");
						});
						var msg = productName + " was successfully updated";
						return res.send({message: msg});
					});
				});				
			}
			else {
				return res.send({message: 'You must be an admin to perform this action'});
			}
		});
	}
	else {
		return res.send({message: "You are not currently logged in"});
	}
});

//view users functionality
app.post('/viewUsers', function(req,res) {
	if(req.session && req.session.user) {
		var username = req.session.user;
		mc.query('SELECT * from users where username=?', [username], function(error, results, fields) {
			if(error) {
				res.send({message: 'SQL error'});
			}
			if(results[0].is_admin == "Yes") {
				var fname = req.body.fname;
				var lname = req.body.lname;
				qfname = "%" + fname + "%";
				qlname = "%" + lname + "%";
				mc.query('SELECT fname,lname,username FROM users WHERE fname like ? and lname like ?',[qfname,qlname],function(error,results,fields){
					if(error || results.length <= 0){
						return res.send({message: 'There are no users that match that criteria'});
					}
					return res.send({message: 'The action was successful', user: results});
				});	
			}
			else {
				return res.send({message: 'You must be an admin to perform this action'});
			}
		});
	}
	else {
		return res.send({message: "You are not currently logged in"});
	}
});

//view products
app.post('/viewProducts', function(req,res) {
	var asin = req.body.asin;
	var keyword = req.body.keyword;
	var group = req.body.group;
	qasin = asin;
	qgroup = "%" + group + "%";
	if(!asin) {
		mc.query('SELECT asin,productName FROM products_read WHERE MATCH(productName, productDescription) AGAINST (?) and groups like ?',[keyword,qgroup],function(error,results,fields){
		if(error || results.length <= 0){
			return res.send({message: 'There are no products that match that criteria'});
		}
		return res.send({product: results});
		});	
	}
	if(asin) {
		mc.query('SELECT asin,productName FROM products WHERE asin=?',[qasin],function(error,results,fields){
		if(error || results.length <= 0){
			return res.send({message: 'There are no products that match that criteria'});
		}
		return res.send({product: results});
		});
	}
});

//view purchased products - only admin has access
app.post('/productsPurchased', function(req, res) {
	if(req.session && req.session.user) {
		var user = req.session.user;
		mc.query('SELECT * from users where username=?', [user], function(error, results, fields) {
			if(error) {
				res.send({message: 'SQL error'});
			}
			if(results[0].is_admin == "Yes") {
							var targetUser = req.body.username;
							mc.query('select b.productName as productName, count(a.asin) as quantity from purchaseHistory a, products b where a.user=? and a.asin=b.asin group by a.asin',[targetUser],function(error,results,fields){
								if(error || results.length <= 0){
									return res.send({message: 'There are no users that match that criteria'});
								}
								return res.send({message: 'The action was successful', products: results});
							});	
			}
			else {
				return res.send({message: 'You must be an admin to perform this action'});
			}
		});
	}
	else {
		return res.send({message: "You are not currently logged in"});
	}
});

//purchase products
app.post('/buyProducts', function(req, res) {
	if(req.session && req.session.user) {
		var user = req.session.user;
		var products = req.body.products;
		var ListOfProductIds = [];
		for(var i=0;i< products.length;i++) {
			ListOfProductIds[i] = products[i].asin;
		}
		console.log("List Of Product IDs" + ListOfProductIds);
		
		var utcDate = new Date().getTime();
		mc.query('INSERT into orderDetails (user,purchaseTime) values (?,?)',[user,utcDate],function(error,results,fields){
				if(error || results.length <= 0){
					console.log("Error updating the order details");
				}
				console.log("Order details inserted successfully");
				var orderID = 0;
				mc.query('SELECT orderID from orderDetails where user=? and purchaseTime=?',[user,utcDate],function(error, results, fields) {
					if(error || results.length <= 0) {
						console.log("No matching Order ID");
					}
					orderID = results[0].orderID;
					console.log("orderID " + orderID);
					var params = "";
					for(var i=0; i<ListOfProductIds.length; i++) {
						if(params.length > 0) {
							params += ",";
						}
						params += `('${user}','${ListOfProductIds[i]}','${orderID}')`;
					}
					console.log("parameters" + params);
					
					var query = 'INSERT into purchaseHistory values ' + params;
					mc.query(query, function(error, resultss, fields) {
						if(error) {
							
							return res.send({message: "There are no products that match that criteria"});
						}
						return res.send({message: "The action was successful"});
					});
				});
		});
	}
	else {
		return res.send({message: "You are not currently logged in"});
	}
});

//get recommendations for a product
app.post('/getRecommendations', function(req, res) {
	if(req.session && req.session.user) {
		var asin = req.body.asin;
		mc.query('SELECT asin from (select asin from purchaseHistory where orderID in (select DISTINCT orderID from purchaseHistory where asin=?) and asin!=?) as temp group by asin order by count(asin) desc limit 5', [asin,asin], function(error, results, fields) {
			if(error || results.length <= 0){
				return res.send({message: 'There are no recommendations for that product'});
			}
			return res.send({message: 'The action was successful', products: results});
		});
	}
	else {
		return res.send({message: "You are not currently logged in"});
	}
});


app.all("*", function(req,res,next) {
	return res.send('Page not found.');
	next();
});

app.listen(5000, function() {
	console.log('Node app is running on port 5000');
});