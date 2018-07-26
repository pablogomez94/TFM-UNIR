import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable } from 'rxjs/Observable';
import{Router} from '@angular/router';
import {UserHttp} from '../http/user';
import{fichaje} from '../clases/fichaje';


@Component({
  selector: 'app-fichar',
  templateUrl: './fichar.component.html',
  styleUrls: ['./fichar.component.css']
})
export class FicharComponent implements OnInit {
  userhttp:UserHttp=new UserHttp(this.http)
  eventos:any;
  eventosDisponibles:any=[];
  eventosActuales:any=[];
  evento:number;
  
  longitud:number=3.4567;
  latitud:number=-3.4567;
  ubicacion:boolean=true;
  
  accurate:boolean=false;
  finJornada:boolean=false;
  sinUbicacion:boolean=false;
  esJornada:boolean=false;
  admin:boolean=false;
  ECliente:boolean=false;

  constructor(public http: HttpClient,private router: Router) { }
  
  
  ngOnInit() {
    this.cliente="";
    let token=sessionStorage.getItem("token");
    if(token!=null){
      this.userhttp.isLogged(1,token).subscribe(exito=>{
        console.log("Es administrador")
        this.admin=true;
        this.userhttp.esJornada(token).subscribe(
          exito=>{
            var esJornada:any=exito
            if(esJornada.estado==0){
              this.esJornada=false;
            }else{
              this.esJornada=true;
            }
            this.getEventos();
            this.setLocation();
          },
          error=>{console.log(error)}
        )
      },
        error=>{
         
      this.userhttp.isLogged(0,token).subscribe(
        exito=>{
          this.admin=false;
          this.userhttp.esJornada(token).subscribe(
            exito=>{
              var esJornada:any=exito
              if(esJornada.estado==0){
                this.esJornada=false;
              }else{
                this.esJornada=true;
              }
              this.getEventos();
              this.setLocation();
            },
            error=>{console.log(error)}
          )
         
        }
        ,error=>{
          this.router.navigate(["login"])
        });});
      }else{
        this.router.navigate(["login"])
      }
      
  
    
    
    
  }
  async prueba(){
    
  }
  async filtrarEventos(){
    
    this.finJornada=false;
    this.eventosDisponibles=[];
    console.log("-------")
    console.log(this.eventosActuales);
    if(this.eventosActuales.length==0){
      this.eventosDisponibles.push(this.eventos.find(x=>x.nombre=="EJornada"));
    }else if(this.eventosActuales.length>0){
      var ultimoEvento=this.eventosActuales[this.eventosActuales.length-1].evento;
      
      this.ECliente=false;
      switch(ultimoEvento){
        case "EJornada":{
          this.eventosDisponibles.push(this.eventos.find(x=>x.nombre=="SCliente"));
          this.eventosDisponibles.push(this.eventos.find(x=>x.nombre=="SComida"));
          this.eventosDisponibles.push(this.eventos.find(x=>x.nombre=="SJornada"));
        } break;
        
        case "ECliente":{
          this.eventosDisponibles.push(this.eventos.find(x=>x.nombre=="SCliente"));
          if(this.eventosActuales.find(x=>x.evento=="EComida")==undefined){
            this.eventosDisponibles.push(this.eventos.find(x=>x.nombre=="SComida"));
          }
          this.eventosDisponibles.push(this.eventos.find(x=>x.nombre=="SJornada"));
          
        } break;
        case "SCliente":{ this.ECliente=true;this.eventosDisponibles.push(this.eventos.find(x=>x.nombre=="ECliente"));} break;
        case "EComida":{
          this.eventosDisponibles.push(this.eventos.find(x=>x.nombre=="SJornada"));
          this.eventosDisponibles.push(this.eventos.find(x=>x.nombre=="SCliente"));
        } break;
        
        case "SComida":{
          this.eventosDisponibles.push(this.eventos.find(x=>x.nombre=="EComida"));
        } break;
        
        case "SJornada":{
          this.finJornada=true;
        } break;
        
      }
    }
    if(this.eventosDisponibles.length>0) this.evento=this.eventosDisponibles[0].id;

    
  }
  
  cambiarEvento(i){
    console.log(i);
    this.evento=i;
  }
  
  cambiarEventos(evento){
    if(evento==3){
      this.ECliente=true;
    }
  }

  cerrarS(){
    let token=sessionStorage.getItem("token");
    if(token!=null){
      this.userhttp.UpdateToken(token).subscribe(
        exito=>{
          sessionStorage.removeItem("token");
          this.router.navigate(["login"]);
        },
      error=>{console.log(error)}
    )
     
    }
   
  }


  setLocation(){
    if(window.navigator.geolocation){
      window.navigator.geolocation.getCurrentPosition(this.setPosition.bind(this),this.error.bind(this),{
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      });
    };
    
    setTimeout(() => 
    {
      this.setLocation();
    },
    40000);
  }
  
  setPosition(position){
   
    this.ubicacion=true;
    this.accurate=true;
    this.latitud=position.coords.latitude;
    this.longitud=position.coords.longitude;
  }
  error(ub){
    this.ubicacion=false;

  
  }
  
  
  getEventos(){
    var error=false;
    this.userhttp.getEvents().subscribe(
      exito=>{
        this.eventos=exito;
        if(this.eventos.length>0){
          this.getFichajes();
        }
        
      },
      error=>{console.log(error);return false;}
    )
  }
  
  
  getFichajes(){
    let token=sessionStorage.getItem("token");
    if(token!=null){
      
      this.userhttp.getFichajes(token).subscribe(
        exito=>{this.eventosActuales=exito;this.filtrarEventos();},
        error=>{console.log(error)}
      )
    }
    
  }
  
  cliente="";
  RealizarFichaje(){
    var latlng="NaN";
    var precision=0;
    
    if (!this.sinUbicacion){
      latlng=this.latitud+","+this.longitud;
      precision=1;
    }
    let token=sessionStorage.getItem("token");
    if(token!=null){
      let f=new fichaje(precision,this.evento,latlng);
      f.cliente=this.cliente;
      this.userhttp.PostFichaje(f,token).subscribe(
        exito=>{this.getFichajes();},
        error=>{console.log(error)}
      )
    }else{
      
    }
  }
  
  
}
