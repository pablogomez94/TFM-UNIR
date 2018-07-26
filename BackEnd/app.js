'use scrict'

var express=require('express');
var bodyParser=require('body-parser');

var app=express();
var api= require("./routes/rutas");

app.use(function (req, res, next) {
    console.log("entrando en el express")
     // Website you wish to allow to connect
     res.header('Access-Control-Allow-Origin', '*');
 
     // Request methods you wish to allow
     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
 
     // Request headers you wish to allow
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,x-access-token");
 
     // Set to true if you need the website to include cookies in the requests sent
     // to the API (e.g. in case you use sessions)
     res.header('Access-Control-Allow-Credentials', true);
 
     // Pass to next layer of middleware
     next();
 });

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());



app.use(api)



module.exports=app;