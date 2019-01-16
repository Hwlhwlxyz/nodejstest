var mysqlfunc = require('./mysqlfunc')
/*
function findUser(name, password){
	return users.find(function(item){
		return item.name === name && item.password ===password;
	});
};
*/

var findUser = function(name, password, cbfunction){
	var sqlcmd = "select * from user where username = '" + name + "' and password = '" + password + "';";
	console.log(sqlcmd);
	mysqlfunc.getsqlresult(sqlcmd, cbfunction);
};

//login


function buy(userid, productid){
	
}




module.exports = {
	findUser
}
