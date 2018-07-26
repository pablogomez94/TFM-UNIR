import { Component, OnInit ,OnChanges} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable } from 'rxjs/Observable';
import{Router} from '@angular/router';
import {UserHttp} from '../http/user';
import{fichaje} from '../clases/fichaje';
import {IMyDpOptions} from 'mydatepicker';
//import {GoogleMapsAPIWrapper} from '@agm/core';
@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.css']
})
export class HistoricoComponent implements OnInit {
  mostrado:number=-1;
  userhttp:UserHttp=new UserHttp(this.http);
  usuarios:any;
  fecha1:Date=new Date();
  fecha2:Date=new Date();
  eventos=[];
  map: any;
  ubicacion:boolean=true;
  accurate:boolean=false;
  latitud:number=40.489858399999996;
  longitud:number=-3.3450297;
  
  
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
      this.userhttp.isLogged(1,token).subscribe(
        exito=>{
          console.log("EXITO");
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

    TrabajadoDiff(t){
     return Math.floor(t/60);
    }

    TrabajadoFormat(t){
      console.log(t);
     let h= Math.floor(t/3600);
     let m=Math.floor((t%3600) / 60);
     return h+ " horas y " + m + " minutos"
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
      console.log(this.longitud);
      
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
    
    mostrar(i,usuario){
      
      if(this.mostrado==i){
        this.mostrado=-1;
      }else{
        this.mostrado=i;
      }
      console.log(usuario);
      console.log(this.mostrado);
      var f1=this.fecha1.getTime()/1000 |0;
      var f2=this.fecha2.getTime()/1000 |0;
      console.log(f2);
      this.obtenerEventos(f1,f2,usuario);
      
    }
    obtenerEventos(FIni,FFin,User){
      let token=sessionStorage.getItem("token");
      
      this.userhttp.getFichajesUser(FIni,FFin,User,token).subscribe(
        exito=>{this.eventos=exito;},
        error=>{console.log(error)}
      )
    }
    
    obtenerUsuarios(){
      let token=sessionStorage.getItem("token");
      if(token!=null){
        this.userhttp.getUsers(token).subscribe(
          exito=>{
            this.usuarios=exito;
          },
          error=>{
            console.log(error);
          }
        );
      }
    }
    
  }
  