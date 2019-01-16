var mongoose = require('mongoose')
var url = "mongodb://cssuser:username@ip:port/databasename";
 
var options = { 
    server: { 
        socketOptions: { 
            keepAlive: 1, 
            connectTimeoutMS: 30000 
        } ,
        reconnectTries:30,
        reconnectInterval:3000
    }, 
    replset: { 
        socketOptions: { 
            keepAlive: 1, 
            connectTimeoutMS: 30000 
        } 
    },
    useNewUrlParser: true 
};

mongoose.connect(url, { useNewUrlParser: true });

mongoose.connection.on('connected', function () {    
    console.log('Mongoose connection open to ' + url);  
});    

mongoose.connection.on('error',function (err) {    
    console.log('Mongoose connection error: ' + err);  
});  

mongoose.connection.on('disconnected', function () {    
    console.log('Mongoose connection disconnected');  
});    



//Schema
var userSchema = new mongoose.Schema({
    userid: String,
    password: String, 
    username: String,    
    phone: String,   
    email: String,   
    address: String
});

var productSchema = new mongoose.Schema({
    productid: String,
    productname: String,
    seller: String, 
    sellerid: String, //userid
    number: Number,
});

var topicSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String,
    authorid: String,
    time:String
    
});

var commentSchema = new mongoose.Schema({
    topicid: String,
    time: String,
    authorid: String,
    author: String,
    comment: String
});




var user_model = mongoose.model('User', userSchema);
var product_model = mongoose.model('Product', productSchema);
var topic_model = mongoose.model('Topic', topicSchema);
var comment_model = mongoose.model('Comment', commentSchema);

module.exports = {
    user_model,
    product_model,
    topic_model,
    comment_model
}

