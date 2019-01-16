var express = require('express');
var router = express.Router();

var mongodbfunc = require('../models/mongodbfunc');
var topic_model = mongodbfunc.topic_model;
var comment_model = mongodbfunc.comment_model;

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



/* GET  listing. */
router.get('/', function(req, res, next){
	topic_model.find(function(err, data){
		if(err){ return console.log(err)}
		res.send(data)
	});
});

router.get('/add', function(req, res, next) {
  res.render('topicadd.html');
});
router.post('/add', function(req, res, next){
	var sess = req.session;
	var loginUser = sess.loginUser;
	var isLogin = !!loginUser;
	var userId = sess.userId;

	var newTopic = new topic_model({
	    title: req.body.title,
	    content: req.body.content,
	    author: loginUser,
	    authorid: userId,
	});

  newTopic.save(function(err, data){
    if(err){ return console.log(err) }
    res.send(data);
  });
});

router.get('/topic_detail/:id', function(req, res, next){
	var id = req.params.id;
	topic_model.findOne({_id: id}, function(err, topicdata) {
		console.log(id);
		console.log(topicdata);
    	res.render("commentadd.html", {topicdata: topicdata});
	});
});
router.post('/topic_detail/', function(req, res, next){
	var id = req.body.topicid;
	var sess = req.session;
	var loginUser = sess.loginUser;
	var isLogin = !!loginUser;
	var userId = sess.userId;

	newComment = comment_model({
		topicid: id,
	    comment: req.body.comment,
	    author: loginUser,
	    authorid: userId,
	});

	console.log(newComment);
	newComment.save(function(err, data){
	    if(err){ return console.log(err) }
	    res.send(data);
    });
});




router.get('/topic_comments/:topic_id', function(req, res, next){
	var topic_id = req.params.topic_id;
	topic_model.findOne({_id: topic_id}, function(errt, datat){
		comment_model.find({topicid: topic_id}, function(errc, datac){
			res.send({topic: datat, comment: datac});
		});
	});
});



module.exports = router;