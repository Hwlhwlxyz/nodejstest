var express = require('express');
var router = express.Router();

var mongodbfunc = require('../models/mongodbfunc');
var user_model = mongodbfunc.user_model

var cookieParser = require('cookie-parser');
var secretkey = "1234567890123456"
var secretiv = "1234567890123456"

var identityKey = 'key';
var session = require('express-session');
var FileStore = require('session-file-store')(session);

var crypto = require('crypto')




var encrypt = function (key, iv, data) {
	var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
	var crypted = cipher.update(data, 'utf8', 'binary');
	crypted += cipher.final('binary');
	crypted = new Buffer(crypted, 'binary').toString('base64');
	return crypted;
};

var decrypt = function (key, iv, crypted) {
	crypted = new Buffer(crypted, 'base64').toString('binary');
	var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
	var decoded = decipher.update(crypted, 'binary', 'utf8');
	decoded += decipher.final('utf8');
	return decoded;
};


router.use(session({
	name : identityKey,
	secret : 'name1', 
	store : new FileStore(), 
	resave : false, 
	cookie : {
		maxAge: 60*1000
	}
}));



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});




router.get('/list', function(req, res, next){
	user_model.find(function(err, data){
		if(err){ return console.log(err)}
		strdata = JSON.stringify(data)
		bufferdata = new Buffer(strdata)
		base64data = bufferdata.toString('base64')
		//encryptdata = encrypt(secretkey, secretiv, strdata)
		//console.log(encryptdata)
		//var decryptdata = decrypt(secretkey, secretiv, encryptdata);
		//console.log("decrypt:", decryptdata);
		//res.send(encryptdata)
		res.send(data);
		//res.send(base64data)
		//res.send(decryptdata)
	});
});


router.get('/login', function(req, res, next){
	

	var sess = req.session;
	var loginUser = sess.loginUser;
	var isLogin = !!loginUser;
	//use html
	res.render('userlogin.html', {
		title: 'HTML',
		isLogin: isLogin,
		name: loginUser || ''
	});
});

router.post('/login', function(req, res, next){
	var sess = req.session;
	var username = req.body.name;
	var password = req.body.password;

	console.log('login');
	user_model.findOne({username: username}, function (err, data){
		if (data['username'] === username && data['password'] === password){
			req.session.regenerate(function(err){
				if(err){
					return res.json({ret_code: 2, ret_msg: 'login failed'});
				}
			req.session.loginUser = username;
			req.session.userId = data['_id'];
			
			res.json({ret_code: 0, ret_msg: 'login succeeded'});
			});
		}else{
			res.json({ret_code: 1, ret_msg: 'name or pswd error'})
		};
	});

	
});





router.get('/logout', function(req, res, next){
	req.session.destroy(function(err){
		if(err){
			res.json({ret_code: 2, ret_msg: 'logout error'});
			return;
		}
		res.clearCookie(identityKey);
		//res.send('logout')
		res.redirect('/users/login');
	});
});


router.get('/add', function(req, res, next) {
  res.render('useradd.html');
});
router.post('/add', function(req, res, next) {
  var newUser = new user_model({
    username: req.body.username,
    password: req.body.password
  });
  //console.log(newUser);
  newUser.save(function(err, data){
    if(err){ return console.log(err) }
    res.redirect('/users/add');
  });
});


router.get('/edit/:id', function (req, res, next) {
  var id = req.params.id;
  user_model.findOne({_id: id}, function (err, data) {
    res.render('useredit.html', {
      user: data
    })
  })
});
router.post('/update', function (req, res, next) {
  var id = req.body.id;
  user_model.findById(id, function (err, data) {
    if(err){ return console.log(err); }
    data.username = req.body.username;
    data.password = req.body.password;
    data.save(function(err){
    	res.send(data + "save");
      //res.redirect('/users/list');
    })
  })
});



router.delete('/del', function (req, res) {
  var id = req.query.id;
  userModel.remove({_id: id}, function (err, data) {
    if(err){ return console.log(err); }
    res.json({code: 200, msg: id + 'delete'});
  })
})

module.exports = router;


