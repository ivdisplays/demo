var express = require('express');
var exphbs  = require('express-handlebars');
var mysql = require('mysql');
var bodyParser = require("body-parser");

var pool = mysql.createPool({
    connectionLimit : 100, //focus it
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'ramya_mood_app'
    
    
});


 
var app = express();
 app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function(req, res){
	 //res.send('Inserted Successfully!')
	    pool.getConnection(function(error,conn){

                 conn.query("SELECT * FROM registration", function (err, result, fields) 
                  {
				    if (err) throw err;

				    var dt="";
				  

                  for(var i=0;i<result.length;i++)
                  {
                      dt=dt+"<tr><td>"+result[i].name+"</td><td>"+result[i].email+"</td><td><form action='http://localhost:3000/edit' class='editbutton' method='post'><input type='hidden' name='eid' value='"+result[i].id+"'><button type='submit' class='btn btn-primary'>Edit</button></form><form action='http://localhost:3000/delete' method='post'><input type='hidden' name='did' value='"+result[i].id+"'><button type='submit' class='btn btn-danger'>Delete</button></form></td></tr>";
                  }

                     res.render('index', { result:dt });
				  });


 

  conn.release();
});
	    
   });



app.post('/add', function(req, res)
{          
  res.render('form', { name:'', email:'',password:'',id:'' });                  
                     
});


app.post('/edit', function(req, res){


  
	    pool.getConnection(function(error,conn)
	    {

 var queryString = "SELECT * FROM registration WHERE `id` = '"+req.body.eid+"' " ;

         conn.query(queryString,function(error,result)
           {
             if(error)
               {
                   throw error;
               }
               else
               {  
                  for(var i=0;i<result.length;i++)
                  {                     
                    res.render('form', { name:result[i].name, email:result[i].email,password:result[i].pwd,id:result[i].id });

                  }
                                     	
               }
            }); 

        });// end of delete

});

app.post('/insert', function(req,res){
    
   pool.getConnection(function(error,conn){

    email = req.body.email;  
    pwd = req.body.pwd;  
    name = req.body.name;
       
       var queryString = "insert into registration(name,email,pwd) values('"+name+"','"+email+"','"+pwd+"')";
       
       conn.query(queryString,function(error,results){
           if(error)
               {
                   throw error;
               }
           else 
               {
                 
                  res.render('add',{ })
               }
           
       });
       conn.release();
   });
    
    
});

app.post('/update', function(req, res){
  
	    pool.getConnection(function(error,conn)
	    {

	    var queryString = "Update  registration SET name='"+req.body.name+"',email='"+req.body.email+"',pwd='"+req.body.pwd+"' WHERE id = '"+req.body.id+"' " ;
         conn.query(queryString,function(error,results)
           {
             if(error)
               {
                   throw error;
               }
               else
               {
               	  res.render('update', { })
         
               	
               }
           });    

        });// end of delete

});


app.post('/delete', function(req, res){
  
	    pool.getConnection(function(error,conn)
	    {

	    var queryString = "Delete FROM registration WHERE `id` = '"+req.body.did+"' " ;
         conn.query(queryString,function(error,results)
           {
             if(error)
               {
                   throw error;
               }
               else
               {
               	  res.render('delete', { })
         
               	
               }
           });    

        });// end of delete

});

app.listen(3000);