'use scrict'
const config=require("../config");
/*Modelo de la base de datos que se conecta con ella */
var mysql= require('mysql');

var con= mysql.createConnection({
    host:config.HOST,
    database:config.DATABASE,
    user:config.USER,
    password:config.PASS,
    multipleStatements: true
    
});


con.connect((err)=>{
    if (err) throw err;
    else{
        console.log("conectado a la base de datos ");
    }
});


module.exports={con}