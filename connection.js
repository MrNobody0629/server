var mysql = require('mysql')

var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'reactdb'
})

con.connect(function(err) {
    if (err)
    {
      console.log("Connection Refused!");
    }
    else
    {
      console.log("Connected!");
    }
  });


module.exports =con;