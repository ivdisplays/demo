const http = require("http");
const express = require('express');
const app = express();
const mysql      = require('mysql');
const bodyParser = require('body-parser');

//create app server
const pool = mysql.createPool({
    connectionLimit : 100, //focus it
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'ramya_mood_app'
    
    
});

  pool.getConnection(function(err)
  {
    if (err) throw err
  console.log('You are now connected...')
})
//end mysql connection

//start body-parser configuration
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
//end body-parser configuration

app.listen(3500);



//rest api to get all results
app.get('/registration', function (req, res) 
{
   pool.getConnection(function(error,conn)
   {
     conn.query("SELECT * FROM registration", function (err, result, fields)
     {
        if (err) throw err;
          res.end(JSON.stringify(result));

      }); 

      conn.release();
    });
});

//rest api to get a single registration data
app.get('/registration/:id', function (req, res) 
{
  pool.getConnection(function(error,conn)
   {
     conn.query('select * from registration where id=?', [req.params.id], function (error, results, fields) {
         if (error) throw error;
       res.end(JSON.stringify(results));
      });

      
    });
   
   
});

//rest api to create a new record into mysql database
app.post('/registration', function (req, res) {
   

   pool.getConnection(function(error,conn)
   {

    email = req.body.email;  
    pwd = req.body.pwd;  
    name = req.body.name;

       var postData  = req.body;


       
       var queryString = "insert into registration(name,email,pwd) values('"+name+"','"+email+"','"+pwd+"')";

     conn.query(queryString,function (error, results, fields) 
        {
          if (error) throw error;
          res.end(JSON.stringify(results));
        });

      
    });

   
});

/*

//rest api to update record into mysql database
app.put('/registration', function (req, res) {
   connection.query('UPDATE `registration` SET `registration_name`=?,`registration_salary`=?,`registration_age`=? where `id`=?', [req.body.registration_name,req.body.registration_salary, req.body.registration_age, req.body.id], function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});*/

//rest api to delete record from mysql database
app.delete('/registration', function (req, res) {
   console.log(req.body);
   connection.query('DELETE FROM `registration` WHERE `id`=?', [req.body.id], function (error, results, fields) {
	  if (error) throw error;
	  res.end('Record has been deleted!');
	});
});
