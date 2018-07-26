'use scrict'

var express = require ('express');
//var controlador= require("../controllers/controlador");
var usuarios=require("../controllers/auth");
var fichajes=require("../controllers/fichajes");

var api=express.Router();

api.put("/api/UpdateToken",usuarios.UsuarioValido,usuarios.updateToken);
api.get('/api/getJornadas/:horario',usuarios.AdminValido,fichajes.ObtenerJornadas);
api.get('/api/islogged/:admin',usuarios.UsuarioLogueado);
api.get('/api/getFichajesUser/:FIni/:FFin/:id/',usuarios.AdminValido,fichajes.getFichajesUser);
api.get('/api/gethorarios',usuarios.AdminValido,usuarios.ObtenerHorarios);
api.get('/api/esJornada',usuarios.UsuarioValido,fichajes.EsJornada);
api.get('/api/getFichajesUserOnly/:FIni/:FFin/',usuarios.UsuarioValido,fichajes.getFichajesUserOnly);
api.get('/api/getUsers',usuarios.AdminValido,usuarios.ObtenerUsuarios);
api.get('/api/getInfoUsers',usuarios.AdminValido,usuarios.ObtenerInfoUsuarios);
api.get('/api/eventos',fichajes.getEventos);
api.post('/api/insertFichaje',usuarios.UsuarioValido,fichajes.insertFichajeUser);

api.put('/api/updateHorario',usuarios.AdminValido,usuarios.UpdateHorario);
api.post('/api/insertHorario',usuarios.AdminValido,usuarios.InsertHorario);
api.get('/api/borrable/:horario',usuarios.AdminValido,usuarios.horarioBorrable);
api.delete('/api/borrarHorario/:horario',usuarios.AdminValido,usuarios.borrarHorario);

api.post('/api/createUser',usuarios.AdminValido,usuarios.CrearUsuario);
api.get('/api/existsUser/:user',usuarios.AdminValido,usuarios.ExisteUsuario);
api.put('/api/updateUser',usuarios.AdminValido,usuarios.EditarUsuario);
api.post('/api/deleteUser',usuarios.AdminValido,usuarios.borrarusuario);

api.get('/api/getFichajesJornada',usuarios.UsuarioValido,fichajes.getFichajesJornada);
api.post('/api/ObtenerToken',usuarios.LoguearUsuario);
api.get('/api/checkUser',usuarios.AdminValido,(req,res)=>{res.status(200).send({message:'Tienes Acceso'})});
module.exports =api;