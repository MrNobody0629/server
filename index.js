const { json } = require('body-parser');
const jwt = require('jsonwebtoken');
const express = require('express')
var session = require('express-session')
const mysql = require('./connection.js')
var bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs/dist/bcrypt');
const app = express()
const port = 3001;
const host = "http://localhost:";

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());

app.post('/insertNewUser',async (req,res)=>{
    // console.log(req.body);
    try {
      var psw = await bcrypt.hash(req.body.password,4);
      var qry = 'INSERT INTO `users`(`name`, `email`, `contact`,`gender`,`password`) VALUES ("'+req.body.name+'","'+req.body.email+'","'+req.body.contact+'","'+req.body.gender+'","'+psw+'")';
      mysql.query(qry, (err, result, fields)=> {
        if(err)
        {
          res.send(JSON.stringify({
            'status':-1,
            'msg':err.message,
          }))
        }
        else
        {
          res.send(JSON.stringify({
            'status':1,
            'result':result,
            'msg':'success'
          }))
        }
      })
    } catch (err) {
      res.send(JSON.stringify({
        'status':-1,
        'msg':err.message,
      }))
    }
});

app.post('/signin',async (req,res)=>{

  try {
    const {email,password} = req.body;
    // console.log(email + " " + password);
    var qry = 'SELECT * FROM `users` WHERE `email` = "'+email+'"';
    // console.log(qry)
    mysql.query(qry, async (err, result, fields)=> {
      if(err)
      {
        res.send(JSON.stringify({
          'status':-2,
          'msg':err.message,
        }))
      }
      else
      {
        if(result.length === 1)
        {
          var hashpsw = await bcrypt.compare(password,result[0].password);
          if(hashpsw)
          {
            var id = result[0].id;
            // const token = await id.generateAuthToken();
            // console.log(token);
            res.cookie('roomorentUser',id,{
              expires:new Date(Date.now()+30*30*1000),
              httpOnly:true
            })
            res.send(JSON.stringify({
              'status':1,
              'result':result,
              'msg':'success'
            }))
          }
          else
          {
            res.send(JSON.stringify({
              'status':-1,
              'msg':'Wrong Password'
            }))
          }
        }
        else if(result.length === 0)
        {
          res.send(JSON.stringify({
            'status':-1,
            'msg':'Please Enter a Valid Email'
          }))
        }
      }
    }) 
  } catch (error) {
    res.send(JSON.stringify({
      'status':-2,
      'msg':error.message,
    }))
  }
});

app.get('/ok',(req,res)=>{
  res.send("All the way home")
});

app.listen(process.env.PORT || port, () => {
  console.log(`Server running on port ${host}${port}`);
});