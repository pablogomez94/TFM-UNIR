'use strict'
var db=require("../models/modelo");
var service=require("../services/index");

/*Actualiza el token de un usuario*/
function updateToken(request,result){
    var oldtoken=request.user;//token antiguo
    var token=service.CreateIdToken();//nuevo token
    //se actualiza el token antiguo por el nuevo
    db.con.query("update Users set token=? where token=?",[token,oldtoken],(err,res)=>{
        if(err) result.status(500).send({message: "Error en la creación del usuario"});
        return result.status(200).send({message: "token actualizado correctamente"});
    } )
}

/***************************************************************************************/
/*                                      USUARIOS                                       */
/***************************************************************************************/

/*Editar usuario */
function EditarUsuario(request,result){
    console.log("entrando en editar")
    var usuario=request.body.user;//nombre de usuario
    var contrasenia=service.EncryptPassword(request.body.pass);//contraseña encriptada
    var id=request.body.id;//id del usuario
    var rol=request.body.rol;//rol del usuario
    //var horario=request.body.horario;//horario asignado al usuario
    var nombre=request.body.nombre;//nombre del trabajador asignado a dicho usuario
    //actualizar usuario
    db.con.query("update Users set user=?,pass=?,rol=?,nombre=? where id=?",[usuario,contrasenia,rol,nombre,id],(err,res)=>{
        if(err) result.status(500).send({message: "Error en la creación del usuario"});
        return result.status(200).send({"message": "exito"});
    }); 
}

/*Crear usuario */
function CrearUsuario(request,result){
    var usuario=request.body.user;//nombre de usuario
    var contrasenia=service.EncryptPassword(request.body.pass);//contraseña encriptada
    var rol=request.body.rol;//rol del usuario
    var horario=request.body.horario;//horario asignado al usuario
    var nombre=request.body.nombre;//nombre del trabajador asignado a dicho usuario
    
    //comprobar si existe algún usuario con ese nombre de usuario
    db.con.query("select count(*) as cantidad from Users where user=?",[usuario],(err1,res1)=>{
        if(err1) result.status(500).send({message: "Error en la creación del usuario"});       
        else if(res1[0].cantidad>0) result.status(401).send({message: "Este usuario ya existe"});      
        else{
            var token=service.CreateIdToken();
            //insertar
            db.con.query("insert into Users(user,pass,token,rol,horario,nombre) values(?,?,?,?,?,?)",[usuario,contrasenia,token,rol,horario,nombre],(err,res)=>{
                if(err) result.status(500).send({message: "Error en la creación del usuario"});
                
                return result.status(200).send({token: service.CrearToken(token,false)});
            });
        }
    });
    
}

/*Borrar usuario*/
function borrarusuario(request,result){
    console.log("borrando usuario..."+request.body.user)
    var user=request.body.user;//id de usuario
    //borrar el usuario
    db.con.query("delete from Users where id=?",[user],(err,res)=>{
        if(err) result.status(500).send({message: "Error en el borrado del horario"});
        result.status(200).send({message: "Borrado correcto"});
    })
}

/*comprobar si existe el usuario*/
function ExisteUsuario(request,result){
    var usuario=request.params.user;//nombre de usuario
    //obtener el número de usuarios con dicho nombre de usuario
    db.con.query("select count(*) as cantidad from Users where user=?",[usuario],(err1,res1)=>{
        if(err1){ result.status(500).send({message: "Error en la creación del usuario"});
        }
        else if(res1[0].cantidad>0){  result.status(200).send({"exists":true});}
        else{result.status(200).send({"exists":false});}
    });
}

/*Obtener los usuarios de la aplicación con su horario */
function ObtenerUsuarios(request,result){
    db.con.query("select id,nombre,(select nombre from horarios where id=Users.horario) as horario from Users",(err1,res1)=>{
        if(err1) result.status(500).send({message: "Error al obtener usuarios"});
        return result.status(200).send(res1);  
    });
    
}
/*Obtener todos los datos de los usuarios de la aplicación */
function ObtenerInfoUsuarios(request,result){
    db.con.query("select * from Users",(err1,res1)=>{
        if(err1) result.status(500).send({message: "Error al obtener usuarios"});
        for(let i=0;i<res1.length;i++){
            res1[i].pass=service.DecryptPassword(res1[i].pass)
        }
        return result.status(200).send(res1);
    });
    
}
/*Obtener el id de un usuario */
function ObtenerUserId(request,result){
    var token=request.user;
    db.con.query("select id from Users where token=?",[token],(err1,res1)=>{
        if(err1)  result.status(500).send({message: "Error en la consulta"});
        return result.status(200).send({id: res1[0].id});
    })
}



/***************************************************************************************/
/*                                   AUTENTICACIÓN                                     */
/***************************************************************************************/

/*Comprobar si las credenciales coinciden con las de un usuario logueado en la aplicación*/
function LoguearUsuario(request,result){
    console.log("entrandno en loguear usuario")
    console.log(request.body.pass)
    var usuario=request.body.user;//Se obtiene el usuario del cuerpo del request
    var contrasenia=service.EncryptPassword(request.body.pass);//se obtiene la contraseña del cuerpo del request
    
    //se comprueba si existe un usuario con esas credenciales
    db.con.query("select * from Users where user=? and pass=?",[usuario,contrasenia],(err1,res1)=>{
        
        if(err1) result.status(500).send({message: "Error en la consulta"});//en caso de error, se devuelve error 500
        else if(res1.length==0) result.status(401).send({mensaje: "El usuario no existe o la contraseña es incorrecta"});
        //si no se encuentra, se devuelve error 401
        
        else{
            //en caso de que exista se envía el token cifrado generado en la función CrearToken 
            //a la que se le pasa el token del usuario y el rol del mismo.
            return result.status(200).send({token: service.CrearToken(res1[0].token,res1[0].rol)});
        }
    })
}

/*Comprueba si el usuario está logueado comprobando que la variable de sesión que se envía, al desencriptarla coincida con el usuario*/
function UsuarioLogueado(req,res){
    var token=req.headers["x-access-token"];//token
    var admin=req.params.admin;//es administrador?
    if(admin==0){//si es un usuario
        service.ObtenerToken(token).then(response=>{
            res.status(200).send({message: "Usuario logueado"});
            
        }).catch(response=>{
            res.status(401).send({message: "Usuario no logueado"});
        });
    }else{//si es un administrador
        service.ObtenerTokenAdmin(token).then(response=>{
            res.status(200).send({message: "Administrador logueado"});
        }).catch(response=>{
            res.status(401).send({message: "Administrador no logueado"});
        })
    }
    
}

/*obtiene el token de un usuario y comprueba si es un usuario válido. En caso de serlo avanza a la siguiente función*/
function UsuarioValido(request,result,next){
    var token=request.headers['x-access-token'];

    service.ObtenerToken(token).then(response=>{
        request.user=response;
        next()
    })
    .catch(response=>{
        result.status(response.status).send({message:response.message});
    })
    
}

/*obtiene el token de un usuario y comprueba si es un administrador (usuario+rol) válido. En caso de serlo avanza a la siguiente función*/
function AdminValido(request,result,next){
    var token=request.headers['x-access-token'];
    console.log("Admin valido?")
    service.ObtenerTokenAdmin(token).then(response=>{
        request.user=response;
        
        next()
    }).catch(response=>{
        console.log(response)
        result.status(response.status).send({message:response.message});
    })
    
}

/***************************************************************************************/
/*                                      HORARIOS                                       */
/***************************************************************************************/

/*Borrar horario */
function borrarHorario(request,result){
    var horario=request.params.horario;//id de horario
    // borrar el horario
    db.con.query("delete from horarios where id=?",[horario],(err,res)=>{
        if(err) result.status(500).send({message: "Error en el borrado del usuario"});
        result.status(200).send({message: "Borrado correcto"});
    })
}

/*Comprueba si el horario es borrable (Se puede borrar): Si no tiene horarios asignados*/
function horarioBorrable(request,result){
    var horario=request.params.horario;//id del horario
    //obtener el número de usuarios con este horario asignado
    db.con.query("SELECT count(*) as cantidad FROM Users where horario=?",[horario],(err1,res1)=>{
        if(err1){ result.status(500).send({message: "Error en la creación del usuario"});}
        else if(res1[0].cantidad>0){  result.status(200).send({"borrable":false});}
        else{result.status(200).send({"borrable":true});}
    });
}

/*Insertar un horario*/
function InsertHorario(request,result){
    var Nhorario=request.body.horario;//nombre del horario
    var values=request.body.values;//valores a insertar
   //insertar el horario
    db.con.query("insert into horarios(nombre) values(?);",[Nhorario],(err,res)=>{
        if(err){console.log("error en los horarios"); result.status(500).send(err);}
        else{
            var horario=res.insertId;
            for(let i=0;i<values.length;i++){
                values[i]["horario"]=horario;//añadir el id del horario a la jornada
                values[i]["dia"]=i+1;//añadir el día a la jornada
            }
            //formateo para insertar jornadas
            var v=[]
            for(let i=0;i<values.length;i++){
              let j=[values[i].Inicio,values[i].Fin,values[i].Gracia,values[i].TTrabajo,values[i].horario,values[i].dia];
              v.push(j); 
            }
            //insertar jornadas asociadas al horario
           db.con.query("insert into jornada(InicioJ,FinJ,Gracia,TTrabajo,horario,dia) values ?",[v],(err2,res2)=>{
                if(err2) result.status(500).send(err2);
                return result.status(200).send({message:"exito"});
            })
        }
    });   
}

/*Actualizar horario */
function UpdateHorario(request,result){
    var Nhorario=request.body.horario;//nombre del horario
    var horario=request.body.horarioID;//id del horario a actualizar
    var values=request.body.values;//jornadas asociadas al horario

            for(let i=0;i<values.length;i++){
                values[i]["horario"]=horario;//añadir el horario a las jornadas
                values[i]["dia"]=i+1;//añadir el día a la jornada
            }

            var i=0;
            //actualizar las jornadas
            
           db.con.query("update jornada set InicioJ=?,FinJ=?,Gracia=?,TTrabajo=? where horario=? and dia=? ",[values[i].Inicio,values[i].Fin,values[i].Gracia,values[i].TTrabajo,values[i].horario,values[i].dia],(err2,res2)=>{
                if(err2){ 
                    console.log(err2)
                    result.status(500).send(err2);
                }
                else{
                    i=1
                    db.con.query("update jornada set InicioJ=?,FinJ=?,Gracia=?,TTrabajo=? where horario=? and dia=? ",[values[i].Inicio,values[i].Fin,values[i].Gracia,values[i].TTrabajo,values[i].horario,values[i].dia],(err2,res2)=>{
                        if(err2){ 
                            console.log(err2)
                            result.status(500).send(err2);
                        }
                        else{
                            i=2
                            db.con.query("update jornada set InicioJ=?,FinJ=?,Gracia=?,TTrabajo=? where horario=? and dia=? ",[values[i].Inicio,values[i].Fin,values[i].Gracia,values[i].TTrabajo,values[i].horario,values[i].dia],(err2,res2)=>{
                                if(err2){ 
                                    console.log(err2)
                                    result.status(500).send(err2);
                                }
                                else{
                                    i=3
                                    db.con.query("update jornada set InicioJ=?,FinJ=?,Gracia=?,TTrabajo=? where horario=? and dia=? ",[values[i].Inicio,values[i].Fin,values[i].Gracia,values[i].TTrabajo,values[i].horario,values[i].dia],(err2,res2)=>{
                                        if(err2){ 
                                            console.log(err2)
                                            result.status(500).send(err2);
                                        }
                                        else{
                                            i=4
                                            db.con.query("update jornada set InicioJ=?,FinJ=?,Gracia=?,TTrabajo=? where horario=? and dia=? ",[values[i].Inicio,values[i].Fin,values[i].Gracia,values[i].TTrabajo,values[i].horario,values[i].dia],(err2,res2)=>{
                                                if(err2){ 
                                                    console.log(err2)
                                                    result.status(500).send(err2);
                                                }
                                                else{
                                                    i=5
                                                    db.con.query("update jornada set InicioJ=?,FinJ=?,Gracia=?,TTrabajo=? where horario=? and dia=? ",[values[i].Inicio,values[i].Fin,values[i].Gracia,values[i].TTrabajo,values[i].horario,values[i].dia],(err2,res2)=>{
                                                        if(err2){ 
                                                            console.log(err2)
                                                            result.status(500).send(err2);
                                                        }
                                                        else{
                                                            i=6
                                                            db.con.query("update jornada set InicioJ=?,FinJ=?,Gracia=?,TTrabajo=? where horario=? and dia=? ",[values[i].Inicio,values[i].Fin,values[i].Gracia,values[i].TTrabajo,values[i].horario,values[i].dia],(err2,res2)=>{
                                                                if(err2){ 
                                                                    console.log(err2)
                                                                    result.status(500).send(err2);
                                                                }
                                                                else{
                                                                    db.con.query("update horarios set Nombre=? where id=? ",[Nhorario,horario],(err2,res2)=>{
                                                                        if(err2){ 
                                                                            console.log(err2)
                                                                            result.status(500).send(err2);
                                                                        }
                                                                        else{
                                                                            return result.status(200).send({message:"exito"});
                                                                        }});
                                                                }});
                                                        }});
                                                }});
                                        }});
                                }});
                        }});
                }  
            });
            
}

/*Obtener todos los horarios */
function ObtenerHorarios(request,result){
    console.log("obteniendo horarios...")
    db.con.query("select * from horarios",(err1,res1)=>{
        if(err1) result.status(500).send({message: "Error al obtener usuarios"});
        return result.status(200).send(res1);
    });
    
}

module.exports={
    ObtenerHorarios,horarioBorrable,borrarHorario,ExisteUsuario,borrarusuario,CrearUsuario,LoguearUsuario,UsuarioValido,AdminValido,ObtenerUsuarios,ObtenerUserId,UsuarioLogueado,ObtenerInfoUsuarios,InsertHorario,UpdateHorario,updateToken,EditarUsuario
}