var mysql = require('mysql');

var sql_host = '181.215.241.41';
var sql_user = 'css';
var sql_password = 'ClientServerSystem';
var sql_database = 'css';


var connection = mysql.createConnection({
	host : sql_host,
	user : sql_user,
	password : sql_password,
	database : sql_database
});
/*
connection.connection(function(err){
	if (err) throw err;
	console.log('connected to mysql');
});
*/
/*
var exequery = connection.query('show tables;', function(err, result){
	if(err){
		console.log('ERROR', err.message);
	};
	console.log(result);
	return result;
});
*/
//exequery;
/*
function exesql(sqlcmd){
	var answer = connection.query(sqlcmd, function(err, result){
		if(err){
			console.log('ERROR', err.message);
		};
		//console.log(result);
		return result;
	});
	//console.log(answer);
	return answer;
};
*/
function exesql2(sqlcmd, callback){
	var sqlanswer
	connection.query(sqlcmd, function(err, result){
		if(err){
			console.log('ERROR', sqlcmd, err.message);
		};
		if(result){
			sqlanswer = result
		};
		callback(err, sqlanswer);
	});
	
};

var getsqlresult = function(sqlcmd, cbfunction){
	exesql2(sqlcmd, cbfunction);//cbfunction = function(err, answer){};
};


//var a = exesql("select username, password from user where username = 'name1';");
//console.log(a[0]);

module.exports = {
	getsqlresult
}

var c = function(e, a){
	console.log(a);
	console.log(a[0]);
	console.log(a[0].username, a[0].password);
};
//getsqlresult("select username, password from user where username = 'name1';",c);
//getsqlresult("select username, password from user where username = 'name1';",c);
