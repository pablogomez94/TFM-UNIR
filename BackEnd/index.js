'use scrict'

var app = require('./app');
var port = process.env.PORT || 3679;
var mysql= require('mysql');




        app.listen(port,function(){
            console.log(`Servidor Express escuchando en el puerto ${port}`);
        
           
        });


