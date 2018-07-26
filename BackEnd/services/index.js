'ues strict'

const jwt=require("jwt-simple");
const moment=require("moment");
const config=require("../config");
const uuidvar=require("uuid/v1");
const crypto=require("crypto");

function CreateIdToken(){
    var token=[];
    return uuidvar();
}

function CrearToken(token,administrador){
//para crear el token cifrado del usuario se le pasará el token propio del usuario
//y el rol que tiene en la aplicación (usuario/administrador). Posteriormente se crea
//un objeto llamado payload que contiene un parámetro llamado sub, que contiene el token,
//iat, que es la fecha en la que se ha generado, exp, que es la fecha de expiración, para
//evitar que el token se pueda utilizar de manera indefinida en caso de secuestro de la sesión
//y por úlitmo el parámetro admin, que indica el rol del usuario. 
//Posteriormente se utiliza la función encode de la librería jwt-simple, pasándole payload y 
//el secreto, que es una contraseña que se encuentra en el archivo de configuración
    const payload={
        sub: token,
        iat:moment().unix(),
        exp:moment().add(1,"days").unix(),
        admin: administrador
    }
    
    return jwt.encode(payload,config.SECRET)
}


function EncryptPassword(pass){
//encripta la contraseña
  var hash = crypto.createCipher('aes-256-ctr',config.PASSCRYPTO);
var crypted = hash.update(pass,'utf8','hex')
crypted += hash.final('hex');
return crypted;
}

function DecryptPassword(pass){
//desencripta la contraseña
    var hash = crypto.createCipher('aes-256-ctr',config.PASSCRYPTO);
    var dec = hash.update(pass,'hex','utf8');
    dec += hash.final('utf8');
    return dec;

}


function ObtenerTokenAdmin(token){
//obtienel el token extraído de un token encriptado en caso de que este no haya expirado y
//sea de un administrador
       var decode=new Promise((resolve,reject)=>{
           try{
               var payload=jwt.decode(token,config.SECRET);

               if(payload.exp<=moment().unix()){
                   reject({
                       status:401,
                       message:"El token ha expirado"
                   })
               }
               if(payload.admin==0){
                reject({
                    status:401,
                    message:"El usuario no es administrador"
                })
               }
               resolve(payload.sub);//token desencriptado
           }catch(err){
                   reject({
                       status:500,
                       message:"token no válido"
                   })
           }
       });
       return decode;//devuelve el token desencriptado
   }


function ObtenerToken(token){
//obtienel el token extraído de un token encriptado en caso de que este no haya expirado
    var decode=new Promise((resolve,reject)=>{
        try{
            var payload=jwt.decode(token,config.SECRET);
            
            if(payload.exp<=moment().unix()){
                reject({
                    status:401,
                    message:"El token ha expirado"
                })
            }
           
            resolve(payload.sub);//token desencriptado

        }catch(err){
           
                reject({
                    status:500,
                    message:"token user  no válido"
                })
        }
    });

    return decode;//devuelve el token desencriptado
}

module.exports={
    CreateIdToken,CrearToken,ObtenerToken,ObtenerTokenAdmin,EncryptPassword,DecryptPassword
}