const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const connection = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'carnet_medical'
});

// User Login

const app = express();

app.get('/user', function (req, res) {
    connection.getConnection(function (err, connection) {

    connection.query('SELECT * FROM user', function (error, results, fields) {
      if (error) throw error;

      res.send(results)
    });
  });
});
// USer SignUp
app.get('/adduser',(req, res) => {
  let user = {name: req.nome, password:req.password};
  let sql = 'INSERT INTO user SET ?';
  let query = db.query(sql, user, (err, result) => {
      if(err)throw err;
      console.log(result);
      res.send('User is added');
  });
});

// Starting our server.
app.listen(3000, () => {
 console.log('Go to http://192.168.1.69:3000/user so you can see the data.');
});
