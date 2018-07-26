'use sctict'

var db=require("../models/modelo");
var moment=require("moment");
var service=require("../services/index");


/***************************************************************************************/
/*                                      FICHAJES                                       */
/***************************************************************************************/

/*Obtener los eventos */
function getEventos(req,res){ 
    db.con.query("select id,nombre from eventos order by id",(err1,res1)=>{
        if(err1){
            throw err;
            res.status(500).send({message:"error"});
        } 
        res.status(200).send(res1)
    });
}

/*Insertar fichaje*/
function insertFichajeUser(req,res){
    var evento=req.body.evento//tipo de evento
    var token=req.user;//token
    var ubicacion=req.body.ubicacion;//lat,long
    var fecha=moment().unix();//fecha actual en formato unix
    var precision=req.body.precision;//precisión
    var cliente=req.body.cliente;
    //obtener el id del usuasrio asignado al token
    db.con.query("select id from Users where token=?",[token],(err1,res1)=>{
        if(err1){
            throw err;
            res.status(500).send({message:"error"});
        }
        
        if(res1.length>0){
            //si existe dicho token asociado a algún usuario, se inserta
            db.con.query("insert into fichajes(Evento,Usuario,Ubicacion,fecha,prec,cliente) values (?,?,?,?,?,?) ",[evento,res1[0].id,ubicacion,fecha,precision,cliente],function(err2,res2){
                if(err2){
                    res.status(500).send({message:"error"});
                    throw err2;
                }
                res.status(200).send({message:"Guardado con éxito"});
            });
        }else{
            throw err;
            res.status(401).send({message:"Usuario no encontrado"});
        } 
    });
}

/*Obtener los fichajes del usuario en unas fechas establecidas */
function getFichajesUser(req,res){
    console.log("entrando en fichajes User")
    var User=req.params.id;
    //obtener el horario
    db.con.query("select horario from users where id=?",[User],function(err1,res1){
        if(err1){ throw err1;console.log(err1); res.status(501).send({message: err1});
    }
    else{
        //obtener las jornadas
        db.con.query("select * from jornada where horario=?",[res1[0].horario],function(err2,res2){
            if(err2){ throw err2;console.log(err2); res.status(501).send({message: "error al obtener las jornadas"});}
            else{
                //parámetros recogidos de fecha de inicio y fin
                var FIniP=req.params.FIni;
                var FFinP=req.params.FFin;
                //conversión de la fecha a inicio de día (00:00:00), en formato unix
                var FIni=moment.unix(FIniP).startOf("day");
                var FFin=moment.unix(FFinP).startOf("day");
                //los días de inicio y de fin
                var diaI=moment.unix(FIniP).day();
                var diaF=moment.unix(FFinP).day();
                if(diaI==0) diaI=7;
                if(diaF==0)diaF=7;
                
                //se obtienen las jornadas para el horario 
                var Jornadas=res2;
                
                //se obtiene la fecha máxima y mínima de la consulta
                var FMin=FIni.clone().add(Jornadas[diaI-1].InicioJ,'seconds').subtract(Jornadas[diaI-1].Gracia,'seconds').unix();
                var FMax=FFin.clone().add(Jornadas[diaF-1].FinJ,'seconds').add(Jornadas[diaI-1].Gracia,'seconds').unix();
                
                //se obtienen los fichajes entre la fecha mínima y máxima
                db.con.query("select *,(select nombre from eventos where id=fichajes.Evento) as nombreEvento,(select io from eventos where id=fichajes.Evento) as tipoEvento from Fichajes where Usuario=? and fecha>=? and fecha<=? order by fecha",[User,FMin,FMax],function(err3,res3){
                    if(err3){
                        throw err3;
                        res.status(500).send({message:"error al obtener los fichajes"});
                    }else{
                        //se irán insertando cada fichaje dentro del día que se corresponda en arrays
                        /*PRIMERO SE SELECCIONA EL DÍA QUE SE VA A COMPARAR*/
                        var dia=diaI-1;
                        var fichajes=res3;
                        var EventosDiarios=[];
                        var EventosTotales=[];
                        var contador=0;
                        var FechaMaximaI=FIni.clone().add(Jornadas[dia].InicioJ,'seconds').subtract(Jornadas[dia].Gracia,'seconds').unix();
                        var FechaMaximaF=FIni.clone().add(Jornadas[dia].FinJ,'seconds').add(Jornadas[dia].Gracia,'seconds').unix();
                        
                        while(FechaMaximaF<=FMax){
                            
                            for(let i=0;i<fichajes.length;i++){
                                if(fichajes[i].fecha>=FechaMaximaI && fichajes[i].fecha<=FechaMaximaF ){
                                    //añadirlo al día,borrarlo del array ya que ya ha sido asignado y pasar al siguiente
                                    EventosDiarios.push(fichajes[i]);
                                    fichajes.splice(i,1);
                                    i=i-1;
                                   
                                }
                                else if(fichajes[i].fecha<FechaMaximaI){
                                    //borrarlo para realizar una iteración menos en el siguiente bucle
                                    fichajes.splice(i,1);
                                    i=i-1;
                                    
                                }
                                else if(fichajes[i].fecha>FechaMaximaF){
                                    //no añadir y salir del bucle ya que el resto de fechas no van a ser de este día (están ordenadas)
                                   
                                    break;
                                }
                            }
                            
                            var f=FIni.clone().add((contador*86400),'seconds').unix();
                            var correcto=true;
                            
                            if(EventosDiarios.length>0 && EventosDiarios[EventosDiarios.length-1].Evento!=2){
                                correcto=false;
                            }
                            var TrabajadoR=TotalTrabajado(EventosDiarios);//Tiempo total trabajado real en esa jornada
                            var TrabajadoT=Jornadas[dia].TTrabajo;//tiempo teórico trabajado en esa jronada
                            //añadir al array de días (cada día contiene los fichajes de ese mismo día)
                            EventosTotales.push({Correcto:correcto,fmin:FechaMaximaI,fmax:FechaMaximaF,dia:f,eventos:EventosDiarios,TrabajadoT:TrabajadoT,TrabajadoR:TrabajadoR});
                            
                            dia=dia+1;
                            contador++;
                            if(dia==7) dia=0;
                            //avanzar en el bucle al siguiente día
                            EventosDiarios=[];
                            FechaMaximaF=FIni.clone().add((contador*86400)+Jornadas[dia].FinJ,"seconds").subtract(Jornadas[dia].Gracia,'seconds').unix();
                            FechaMaximaI=FIni.clone().add((contador*86400)+Jornadas[dia].InicioJ,"seconds").add(Jornadas[dia].Gracia,'seconds').unix();
                        }
                        res.status(200).send(EventosTotales);
                        
                    }
                })
            }
        })}
    }) 
}

/*Obtener los fichajes del usuario en unas fechas establecidas para el usuario que realiza la consulta */
function getFichajesUserOnly(req,res){
    
    db.con.query("select id from users where token=?",[req.user],(err0,res0)=>{
        if(err0){throw err0;console.log(err0);res.status(501).send({message:err0})}
        else{
            console.log(res0)
            var User=res0[0].id;

            
            db.con.query("select horario from users where id=?",[User],function(err1,res1){
                if(err1){ throw err1;console.log(err1); res.status(501).send({message: err1});
            }
            else{
                
                db.con.query("select * from jornada where horario=?",[res1[0].horario],function(err2,res2){
                    if(err2){ throw err2;console.log(err2); res.status(501).send({message: "error al obtener las jornadas"});}
                    else{
                        //parámetros recogidos
                        var FIniP=req.params.FIni;
                        var FFinP=req.params.FFin;
                        //fechas para utilizar
                        var FIni=moment.unix(FIniP).startOf("day");
                        var FFin=moment.unix(FFinP).startOf("day");
                        //los días de inicio y de fin
                        var diaI=moment.unix(FIniP).day();
                        var diaF=moment.unix(FFinP).day();
                        
                        
                        if(diaI==0) diaI=7;
                        if(diaF==0)diaF=7;
                        
                        //se obtienen las jornadas para el horario 
                        var Jornadas=res2;
                        
                        
                        
                        //se obtiene la fecha máxima y mínima de la consulta
                        var FMin=FIni.clone().add(Jornadas[diaI-1].InicioJ,'seconds').subtract(Jornadas[diaI-1].Gracia,'seconds').unix();
                        var FMax=FFin.clone().add(Jornadas[diaF-1].FinJ,'seconds').add(Jornadas[diaI-1].Gracia,'seconds').unix();
                        
                        db.con.query("select *,(select nombre from eventos where id=fichajes.Evento) as nombreEvento,(select io from eventos where id=fichajes.Evento) as tipoEvento from Fichajes where Usuario=? and fecha>=? and fecha<=? order by fecha",[User,FMin,FMax],function(err3,res3){
                            if(err3){
                                throw err3;
                                res.status(500).send({message:"error al obtener los fichajes"});
                            }else{
                                /*PRIMERO SE SELECCIONA EL DÍA QUE SE VA A COMPARAR*/
                                var dia=diaI-1;
                                var fichajes=res3;
                                var EventosDiarios=[];
                                var EventosTotales=[];
                                var contador=0;
                                var FechaMaximaI=FIni.clone().add(Jornadas[dia].InicioJ,'seconds').subtract(Jornadas[dia].Gracia,'seconds').unix();
                                var FechaMaximaF=FIni.clone().add(Jornadas[dia].FinJ,'seconds').add(Jornadas[dia].Gracia,'seconds').unix();
 
                                while(FechaMaximaF<=FMax){
                                    for(let i=0;i<fichajes.length;i++){
                                        
                                        if(fichajes[i].fecha>=FechaMaximaI && fichajes[i].fecha<=FechaMaximaF ){
                                            //añadirlo,borrarlo y pasar al siguiente
                                            EventosDiarios.push(fichajes[i]);
                                            
                                            fichajes.splice(i,1);
                                            i=i-1;
                                        }
                                        else if(fichajes[i].fecha<FechaMaximaI){
                                            //borrarlo
                                            fichajes.splice(i,1);
                                            i=i-1;
                                        }
                                        else if(fichajes[i].fecha>FechaMaximaF){
                                            //no añadir y romper
                           
                                            break;
                                        }
                                        
                                    }
                                    
                                    var f=FIni.clone().add((contador*86400),'seconds').unix();
                                    var correcto=true;
                                    
                                    if(EventosDiarios.length>0 && EventosDiarios[EventosDiarios.length-1].Evento!=2){
                                        correcto=false;
                                    }
                                    var TrabajadoR=TotalTrabajado(EventosDiarios);
                                    var TrabajadoT=Jornadas[dia].TTrabajo;
                                    EventosTotales.push({Correcto:correcto,fmin:FechaMaximaI,fmax:FechaMaximaF,dia:f,eventos:EventosDiarios,TrabajadoT:TrabajadoT,TrabajadoR:TrabajadoR});
                                    
                                    dia=dia+1;
                                    contador++;
                                    if(dia==7) dia=0;
                                    
                                    EventosDiarios=[];
                                    FechaMaximaF=FIni.clone().add((contador*86400)+Jornadas[dia].FinJ,"seconds").subtract(Jornadas[dia].Gracia,'seconds').unix();
                                    FechaMaximaI=FIni.clone().add((contador*86400)+Jornadas[dia].InicioJ,"seconds").add(Jornadas[dia].Gracia,'seconds').unix();
                                }
                                res.status(200).send(EventosTotales);
                                
                            }
                        })
                    }
                })}
            })
        }
    })
}

/*Calcula el total trabajado en segundos de un conjunto de eventos */
function TotalTrabajado(eventos){
    var trabajado=0;
    if(eventos.length>0){//tiene eventos
        if(eventos.length>=2){//tiene 2 o más de eventos (al menos debe tener el de entrada y salida de jornada)
            if((eventos[0].nombreEvento=="EJornada" && eventos[eventos.length-1].nombreEvento=="SJornada") && eventos.length % 2==0){
                //primer y último evento corresponden con la entrada y salida de jornada
                for(let i=1;i<eventos.length;i++){
                    let tipo=eventos[i-1].tipoEvento;
                    let tipo2=eventos[i].tipoEvento;
                    if((tipo==0 && tipo2==1) ||(tipo==1 && tipo2==0)){ //comprueba que se van intercalando los tipos
                        if(eventos[i-1].nombreEvento!="SComida"){//si el de inicio es SComida, no computa como tiempo trabajado
                            trabajado=trabajado+(eventos[i].fecha-eventos[i-1].fecha);// si cumple las condiciones se suma como tiempo trabajado
                        }
                    }else{
                        trabajado=-1;
                        break;
                    }
                }
            }else{
                trabajado=-1;
            }
        }else{
            trabajado=-1;
        }
    }else{
        trabajado=-1;
    }
    return trabajado;
}

/***************************************************************************************/
/*                                      JORNADAS                                       */
/***************************************************************************************/

/*Comprueba si el usuario a una hora determinada en una fecha se encuentra en su jornada de trabajo */
function EsJornada(req,res){
    if(req.user){
        var dia=moment().day();//día
        var fechaActual=moment().startOf("day").unix();//hora inicial del día (00:00:00)
        var f=moment().unix();//fecha actual
        if(dia==0){
            dia=7;
        }
        db.con.query("select horario from users where token=?",[req.user],function(err1,res1){
            if(err1){res.status(401).send({message:"EL usuario no tieene horario asignado"})}
            var horario=res1[0].horario//horario del usuario
            //obtener la jornada del horario en el día en concreto
            db.con.query("select * from jornada where horario=? and dia=? ",[horario,dia],function(err2,res2){
                if(err2){res.status(401).send({message:"el horario no tiene jornadas asignadas para este día"})}
                else{
                    var inicio=moment().startOf("day").unix()+res2[0].InicioJ;
                    var fin=moment().startOf("day").unix()+res2[0].FinJ;
                    //está dentro del horario de fichajes
                    if(f>=inicio && f<=fin){
                        res.status(200).send({estado:1});
                    }
                    //no está dentro del horario de fichajes
                    else{
                        res.status(200).send({estado:0});
                    }
                }
            });
        });
    }
}

/*Obtener los fichajes de la jornada actual*/
function getFichajesJornada(req,res){

    var fechaActual=moment().startOf("day");//fecha del día actual (00:00:00)
    var dia=fechaActual.day();//día actual
    if(dia==0){
        dia=7;
    }
    if(req.user){
        //obtener el horario
        db.con.query("select horario,id from users where token=?",[req.user],function(err1,res1){
            if(err1){res.status(401).send({message:"EL usuario no tieene horario asignado"})}
            var horario=res1[0].horario
            var usuarioId=res1[0].id
            //obtener jornadas asociadas al horario
            db.con.query("select * from jornada where dia=? and horario=? ",[dia,horario],function(err2,res2){
                if(err2){res.status(401).send({message:"el horario no tiene jornadas asignadas para este día"})}
                if(res2.length>0){
                    //obtener fecha de inicio y fin de la jornada
                    var inicioJ=res2[0].InicioJ;
                    var finJ=res2[0].FinJ;
                    var fIni=fechaActual.add(inicioJ,'seconds').unix();
                    var fFin=fechaActual.add(finJ,'seconds').unix();
                    //obtener eventos de dicha jornada basándose en las horas
                    db.con.query("select (select nombre from eventos where id=FIchajes.evento) as evento,fecha from fichajes where fecha>=? and fecha<=? and usuario=?",[fIni,fFin,usuarioId],function(err3,res3){
                        if(err3){throw err3;res.status(401).send({message:"error"})}
                        res.status(200).send(res3); 
                    });
                }else{
                    res.status(200).send({});
                }
            });
        });
    }
}


/*Obtener las jornadas asociadas a un horario*/
function ObtenerJornadas(request,result){
    var horario=request.params.horario
    db.con.query("select * from jornada where horario=?",[horario],(err1,res1)=>{
        if(err1) result.status(500).send({message: "Error al obtener usuarios"});
        return result.status(200).send(res1);
    }); 
}


module.exports={
    getFichajesJornada,insertFichajeUser,getEventos,getFichajesUser,getFichajesUserOnly,ObtenerJornadas,EsJornada
}

