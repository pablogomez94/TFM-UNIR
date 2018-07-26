import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable } from 'rxjs/Observable';
import{Router} from '@angular/router';
import {UserHttp} from '../http/user';
import{fichaje} from '../clases/fichaje';
import {IMyDpOptions} from 'mydatepicker';
import {usuario} from "../clases/usuario";

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  mostrado:number=-1;
  userhttp:UserHttp=new UserHttp(this.http);
  usuarios:any;
  usuario:usuario=new usuario();
  fecha1:Date=new Date();
  fecha2:Date=new Date();
  eventos=[];
  horarios=[];
  horario;
  map: any;
  latitud:number=40.489858399999996;
  longitud:number=-3.3450297;
  error=false;
  errormsg="";
  usuariook=false;
  existsUsuario=false;
  
  constructor(public http: HttpClient,private router: Router) { }
  
  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd.mm.yyyy',
  };
  
  // Initialized to specific date (09.10.2018).
  public model: any = { date: { year: this.fecha1.getFullYear(), month: (this.fecha1.getMonth()+1), day: this.fecha1.getDate() } };
  public model2: any = { date: { year: this.fecha2.getFullYear(), month: (this.fecha2.getMonth()+1), day: this.fecha2.getDate() } };
  
  ngOnInit() {
    
    this.usuario.nombre="";
    this.usuario.id=-1;
    this.usuario.pass="";
    this.usuario.rol=0;
    this.usuario.user="";
    let token=sessionStorage.getItem("token");
    console.log(token)
    if(token!=null){
      this.userhttp.isLogged(1,token).subscribe(
        exito=>{
          console.log("EXITO");
          this.obtenerHorarios()
          this.obtenerUsuarios();
        }
        ,error=>{
          console.log("ERROR");
          this.router.navigate(["login"])
        });
      }else{
        this.router.navigate(["login"])
      }
      
      
    }

    userValido(user){
      if(user.trim()!=""){
      let token=sessionStorage.getItem("token");
     
      if(token!=null){
      this.userhttp.existsUser(token,user).subscribe(
        exito=>{if(exito.exists==true){
          console.log("EXISTE");
          this.existsUsuario=true;
        }else{
          console.log("NO EXISTE");
          this.existsUsuario=false;
        }},
        error=>{console.log("NO")}
      )}
    }else{
      this.existsUsuario=false
    }
      console.log(user);
    }

    mostrarError(msg){
      this.error=true
      this.errormsg=msg;
      setTimeout(function() {
        this.error=false;
      }.bind(this), 3000);
    
    }
    cambiarRol(rol){
      console.log();
    }
    
    protected mapReady(map) {
      console.log("----------------")
      console.log(map);
      this.map = map;
    }
    
    /*public loadAPIWrapper(map) {
      this.map = map;
    }*/
    
    cambiarFecha1(fecha,i){
      this.mostrado=-1;
      console.log(i)
      if(i==0){
        this.fecha1=new Date(fecha.jsdate);
        if(this.fecha2<this.fecha1){
          console.log("cambiando");
          this.fecha2=this.fecha1;
          this.model2={ date: { year: this.fecha2.getFullYear(), month: (this.fecha2.getMonth()+1), day: this.fecha2.getDate() } };
        }
      }else{
        this.fecha2=new Date(fecha.jsdate);
        if(this.fecha2<this.fecha1){
          console.log("cambiando");
          this.fecha1=this.fecha2;
          this.model = { date: { year: this.fecha1.getFullYear(), month: (this.fecha1.getMonth()+1), day: this.fecha1.getDate() } };
        }
      }
      
      /* if(i==0){
        if(this.fecha2<this.fecha1){
          console.log("cambiar");
          this.fecha2=this.fecha1;
        }
      }else{
        if(this.fecha2<this.fecha1){
          console.log("cambiar");
          this.fecha1=this.fecha2;
        }
      }*/
    }
    
    asignarCoordenadas(coord){
      if(coord!="NaN"){
        var lat=Number.parseFloat(coord.split(",")[0]);
        var long=Number.parseFloat(coord.split(",")[1]);
      }
      this.latitud=lat;
      this.longitud=long;
      console.log(this.latitud);
      this.map.setCenter({ lat: this.latitud, lng: this.longitud});
      
      console.log(this.longitud);
      
    }
    
    mostrar(usuario){
      if(usuario==-1){
        this.usuariook=false;
        this.usuario.nombre="";
        this.usuario.id=-1;
        this.usuario.pass="";
        this.usuario.rol=0;
        this.usuario.user="";
        console.log(this.horarios.length);
        if(this.horarios.length>0){
          console.log()
          this.usuario.horario=this.horarios[0].id;
        }
       
      }else{
        this.usuariook=true;
        this.usuario=Object.assign({},this.usuarios.find(x=>x.id==usuario));
      }
      console.log(usuario);
      
      
      
    }
    obtenerEventos(FIni,FFin,User){
      let token=sessionStorage.getItem("token");
      
      this.userhttp.getFichajesUser(FIni,FFin,User,token).subscribe(
        exito=>{this.eventos=exito;console.log(exito)},
        error=>{console.log(error)}
      )
    }
    
    obtenerUsuarios(){
      let token=sessionStorage.getItem("token");
      if(token!=null){
        this.userhttp.getInfoUsers(token).subscribe(
          exito=>{
            this.usuarios=exito;
            console.log(this.usuarios);
          },
          error=>{
            console.log(error);
          }
        );
      }
    }
    
    obtenerHorarios(){
      let token=sessionStorage.getItem("token");
      if(token!=null){
        this.userhttp.getHorarios(token).subscribe(
          exito=>{
            this.horarios=exito;
            if(exito.length>0){
              this.horario=exito[0].id;
              this.usuario.horario=exito[0].id;
            }
            
            console.log(this.horarios)
          },
          error=>{
            console.log(error);
          }
        ) 
      }
    }

  insertar(){
    let token=sessionStorage.getItem("token");
    if(token!=null){
    this.userhttp.InsertUser(token,this.usuario.user,this.usuario.pass,this.usuario.rol,this.usuario.horario,this.usuario.nombre).subscribe(
      exito=>{
        this.ngOnInit();
      },error=>{
        this.mostrarError("Se ha producido un error en la creación del usuario");
      });
    }
  }

  modificar(){
    let token=sessionStorage.getItem("token");
    if(token!=null){
    console.log("entrando en modificar")
    this.userhttp.UpdateUser(token,this.usuario.user,this.usuario.pass,this.usuario.rol,this.usuario.nombre,this.usuario.id).subscribe(
      exito=>{
        this.ngOnInit();
      },error=>{
        this.mostrarError("Se ha producido un error en la modificación del usuario");
      });
    }
  }


  borrar(){
    let token=sessionStorage.getItem("token");
    if(token!=null){
    this.userhttp.DeleteUser(token,this.usuario.id).subscribe(
      exito=>{this.ngOnInit()},
      error=>{ this.mostrarError("Se ha producido un error en el borrado del usuario");}
    )
  }}
    
  }
  
  