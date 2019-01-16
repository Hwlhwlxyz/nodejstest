var express = require('express');
var router = express.Router();

var mongodbfunc = require('../models/mongodbfunc');
var product_model = mongodbfunc.product_model;

var cookieParser = require('cookie-parser');


var identityKey = 'key';
var session = require('express-session');
var FileStore = require('session-file-store')(session);

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
  product_model.find(function(err, data){
		if(err){ return console.log(err)}
		res.send(data)
	});
});


router.get('/add', function(req, res, next) {
  res.render('productadd.html');
});
router.post('/add', function(req, res, next) {
  var newProduct = new product_model({
    productid: req.body.productid,
    productname: req.body.productname,
    seller: req.body.seller, 
    sellerid: req.body.sellerid, //userid
    number: req.body.number
  });
  newProduct.save(function(err, data){
    if(err){ return console.log(err) }
    res.redirect('/products/add');
  });
});


router.get('/edit/:id', function (req, res, next) {
  var id = req.params.id;
  product_model.findOne({_id: id}, function(err, data) {
    res.render('productedit.html', {
      product: data
    });
  });
});
router.post('/update', function (req, res, next) {
  var id = req.body.id;
  product_model.findById(id, function (err, data) {
    if(err){ return console.log(err); }
    console.log(req.body);
    console.log(data);
    data.productname = req.body.productname;
    data.seller = req.body.seller;
    data.sellerid = req.body.sellerid;//userid
    data.number = req.body.number;
    data.save(function(err){
    	res.send(data+"save");
      //res.redirect('/users/list');
    })
  })
});




router.get('/users/');

module.exports = router;
