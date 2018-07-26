import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable } from 'rxjs/Observable';
import{Router} from '@angular/router';
import {UserHttp} from '../http/user';
import{fichaje} from '../clases/fichaje';
import {IMyDpOptions} from 'mydatepicker';
@Component({
  selector: 'app-historico-user',
  templateUrl: './historico-user.component.html',
  styleUrls: ['./historico-user.component.css']
})
export class HistoricoUserComponent implements OnInit {
  
  
  mostrado:number=-1;
  userhttp:UserHttp=new UserHttp(this.http);
  id:any;
  fecha1:Date=new Date();
  fecha2:Date=new Date();
  eventos=[];
  map: any;
  latitud:number=40.489858399999996;
  longitud:number=-3.3450297;
  
  ubicacion:boolean=true;
  accurate:boolean=false;
  
  constructor(public http: HttpClient,private router: Router) { }
  
  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd.mm.yyyy',
  };
  
  // Initialized to specific date (09.10.2018).
  public model: any = { date: { year: this.fecha1.getFullYear(), month: (this.fecha1.getMonth()+1), day: this.fecha1.getDate() } };
  public model2: any = { date: { year: this.fecha2.getFullYear(), month: (this.fecha2.getMonth()+1), day: this.fecha2.getDate() } };
  
  ngOnInit() {
    this.setLocation();
    let token=sessionStorage.getItem("token");
    console.log(token)
    if(token!=null){
      this.userhttp.isLogged(0,token).subscribe(
        exito=>{
          console.log("EXITO");
          var f1=this.fecha1.getTime()/1000 |0;
          var f2=this.fecha2.getTime()/1000 |0;
          this.obtenerEventos(f1,f2);
        }
        ,error=>{
          console.log("ERROR");
          this.router.navigate(["login"])
        });
      }else{
        this.router.navigate(["login"])
      }
      
      
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
      var f1=this.fecha1.getTime()/1000 |0;
      var f2=this.fecha2.getTime()/1000 |0;
      console.log(this.fecha1);
      console.log(this.fecha2)
      this.obtenerEventos(f1,f2)
      
    }
    
    asignarCoordenadas(coord){
      if(coord!="NaN"){
        var lat=Number.parseFloat(coord.split(",")[0]);
        var long=Number.parseFloat(coord.split(",")[1]);
      }
      this.latitud=lat;
      this.longitud=long;
      console.log(this.latitud);
      //this.map.setCenter({ lat: this.latitud, lng: this.longitud});
      
      console.log(this.longitud);
      
    }
    
    
    obtenerEventos(FIni,FFin){
      let token=sessionStorage.getItem("token");
      if(token!=null){
        this.userhttp.getFichajesUserOnly(FIni,FFin,token).subscribe(
          exito=>{this.eventos=exito;console.log(exito)},
          error=>{console.log(error)}
        )
      }
      
    }
    diferencia(t,r){
      console.log(Math.floor((t-r)/60))
      return Math.floor((t-r)/60);
    }
    totalTrabajado(){
      var t=0;
      for(let i=0;i<this.eventos.length;i++){
        
        if(this.eventos[i].TrabajadoT>0){
          t=t+this.eventos[i].TrabajadoT
        }
      }
      console.log("T:"+t);
      return Math.floor(t/3600)+" horas y "+Math.floor((t%3600)/60)+" minutos"
    }
    totalReal(){
      var t=0;
      for(let i=0;i<this.eventos.length;i++){
        if(this.eventos[i].TrabajadoR>0){
          t=t+this.eventos[i].TrabajadoR
        }
      }
      console.log("real"+t+"--"+Math.floor((t%3600)/60))
      return  Math.floor(t/3600)+" horas y "+Math.floor((t%3600)/60)+" minutos"
    }
    diferenciaTotal(){
      var t=0;
      var r=0;
      for(let i=0;i<this.eventos.length;i++){
        if(this.eventos[i].TrabajadoR>0){
          r=r+this.eventos[i].TrabajadoR
        }
        if(this.eventos[i].TrabajadoT>0){
          t=t+this.eventos[i].TrabajadoT
        }
      }
      
      return Math.floor((r-t)/60);
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
      console.log("asdasd")
      console.log(position);
      this.ubicacion=true;
      this.accurate=true;
      this.latitud=position.coords.latitude;
      this.longitud=position.coords.longitude;
    }
    error(ub){
      this.ubicacion=false;
      console.log(this.ubicacion);
      console.log(ub)
      /* while(this.ubicacion==null){
        console.log("sigue siendo null");
      }
      this.ubicacion=false;*/
      //this.ubicacion=false;
    }
    
    
    
  }
  