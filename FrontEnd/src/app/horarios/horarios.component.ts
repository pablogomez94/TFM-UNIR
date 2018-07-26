import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable } from 'rxjs/Observable';
import{Router} from '@angular/router';
import {UserHttp} from '../http/user';
import{fichaje} from '../clases/fichaje';
import {IMyDpOptions} from 'mydatepicker';
import {usuario} from "../clases/usuario";
import * as moment from 'moment';
@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.css']
})
export class HorariosComponent implements OnInit {
  mostrado:number=-1;
  userhttp:UserHttp=new UserHttp(this.http);
  usuarios:any;
  usuario:usuario=new usuario();
  fecha1:Date=new Date();
  fecha2:Date=new Date();
  eventos=[];
  horarios=[];
  jornadas=[{Inicio:0,Fin:0,Gracia:0,TTrabajo:0},{Inicio:0,Fin:0,Gracia:0,TTrabajo:0},{Inicio:0,Fin:0,Gracia:0,TTrabajo:0},{Inicio:0,Fin:0,Gracia:0,TTrabajo:0},{Inicio:0,Fin:0,Gracia:0,TTrabajo:0},{Inicio:0,Fin:0,Gracia:0,TTrabajo:0},{Inicio:0,Fin:0,Gracia:0,TTrabajo:0}];
  horario;
  horSelec:string=""
  myModel="5700";
  constructor(public http: HttpClient,private router: Router) { }
  
  
  ngOnInit() {
    
    this.jornadas=[{Inicio:0,Fin:0,Gracia:0,TTrabajo:0},{Inicio:0,Fin:0,Gracia:0,TTrabajo:0},{Inicio:0,Fin:0,Gracia:0,TTrabajo:0},{Inicio:0,Fin:0,Gracia:0,TTrabajo:0},{Inicio:0,Fin:0,Gracia:0,TTrabajo:0},{Inicio:0,Fin:0,Gracia:0,TTrabajo:0},{Inicio:0,Fin:0,Gracia:0,TTrabajo:0}];
    this.horSelec=""
    let token=sessionStorage.getItem("token");
    console.log(token)
    if(token!=null){
      this.userhttp.isLogged(1,token).subscribe(
        exito=>{
          
          this.obtenerHorarios()
        }
        ,error=>{
          console.log("ERROR");
          this.router.navigate(["login"])
        });
      }else{
        this.router.navigate(["login"])
      }
      
      
    }
    
    
    obtenerHorarios(){
      let token=sessionStorage.getItem("token");
      if(token!=null){
        this.userhttp.getHorarios(token).subscribe(
          exito=>{
            this.horarios=exito;
            
            console.log(this.horarios)
          },
          error=>{
            console.log(error);
          }
        ) 
      }
    }
    v1=true;
    v2=true;
    v3=true;
    v4=true;
    v5=true;
    v6=true;
    v7=true;

    tiempoValido(valor,n){
      console.log(Number.parseInt(valor))
      if(Number.parseInt(valor)==NaN){ 
        switch(n){
          case 1: this.v1=false;break;
          case 2: this.v2=false;break;
          case 3: this.v3=false;break;
          case 4: this.v4=false;break;
          case 5: this.v5=false;break;
          case 6: this.v6=false;break;
          case 7: this.v7=false;break;
        }
        return false
      }
      else{
        if(valor>=0 && valor<=86400 && valor.trim()!=""){
          switch(n){
            case 1: this.v1=true;break;
            case 2: this.v2=true;break;
            case 3: this.v3=true;break;
            case 4: this.v4=true;break;
            case 5: this.v5=true;break;
            case 6: this.v6=true;break;
            case 7: this.v7=true;break;
          }
          return true;
        }else{
          switch(n){
            case 1: this.v1=false;break;
            case 2: this.v2=false;break;
            case 3: this.v3=false;break;
            case 4: this.v4=false;break;
            case 5: this.v5=false;break;
            case 6: this.v6=false;break;
            case 7: this.v7=false;break;
          }
          return false;
        }
      }
   
    }
    borrable=false;
    esBorrable(horario){
      let hor=this.horarios.find(x=>x.id==horario);
      let token=sessionStorage.getItem("token");
      if(token!=null){
        console.log("HORHOR")
        console.log(hor);
        this.userhttp.horarioBorrable(token,hor.id).subscribe(
          exito=>{
          console.log(exito.borrable);
            if(exito.borrable){
              this.borrable=true
            }else{
              this.borrable=false;
            }
            console.log("BORRABLEEE:"+this.borrable)
          },
          error=>{console.log("error")}
        )
      }
    }
    
    obtenerJornadas(horario){
      if(horario>0){
        let hor=this.horarios.find(x=>x.id==horario);
        console.log(hor);
        this.horSelec=hor.Nombre;
        let token=sessionStorage.getItem("token");
        if(token!=null){
          this.userhttp.getJornadas(token,horario).subscribe(
            exito=>{
              this.esBorrable(horario);
              // this.jornadas=exito;
              this.jornadas=[];
              console.log(exito);
              var ex=exito.reverse;
              for(let i=0;i<exito.length;i++){
                var jornada={Inicio:exito[i].InicioJ,Fin:exito[i].FinJ,Gracia:exito[i].Gracia,TTrabajo:exito[i].TTrabajo};
                this.jornadas.push(jornada);
                
              }
              console.log(this.jornadas);
              
            },
            error=>{
              console.log(error);
            }
          ) 
        }}else{
          this.horSelec="";
          this.jornadas=[{Inicio:0,Fin:0,Gracia:0,TTrabajo:0},{Inicio:0,Fin:0,Gracia:0,TTrabajo:0},{Inicio:0,Fin:0,Gracia:0,TTrabajo:0},{Inicio:0,Fin:0,Gracia:0,TTrabajo:0},{Inicio:0,Fin:0,Gracia:0,TTrabajo:0},{Inicio:0,Fin:0,Gracia:0,TTrabajo:0},{Inicio:0,Fin:0,Gracia:0,TTrabajo:0},{Inicio:0,Fin:0,Gracia:0,TTrabajo:0}];
        }
        console.log(this.horSelec)
      }
      
      borrar(id){
        let token=sessionStorage.getItem("token");
        if(token!=null){
          console.log(id)
          this.userhttp.borrarHorario(token,id).subscribe(
            exito=>{console.log(exito);this.ngOnInit()},
            error=>{console.log(error)}
          )
        }
      }
      
      insertar(){
        let token=sessionStorage.getItem("token");
        if(token!=null){
          this.userhttp.PostHorario(token,this.horSelec,this.jornadas).subscribe(
            exito=>{console.log("exito");this.ngOnInit()},
            error=>{console.log(error)}
          )}
          
        }
        
        actualizar(horario){
          let token=sessionStorage.getItem("token");
          if(token!=null){
            this.userhttp.UpdateHorario(token,this.horSelec,this.jornadas,Number.parseInt(horario)).subscribe(
              exito=>{console.log("exito");this.ngOnInit()},
              error=>{console.log(error)}
            )}
          }
          
          cambiarhora(e,hora,tipo){
            var h= moment.duration(hora).asSeconds();
            console.log("ZZZZZZZZZZZ")
            console.log(hora)
            console.log(h)
            if(tipo=="I"){
              this.jornadas[e].Inicio=h;
              console.log("-------")
              console.log(this.jornadas[e].Inicio)
              console.log(this.jornadas[e].Fin)
              console.log("---------------")
              if(this.jornadas[e].Inicio>this.jornadas[e].Fin){
                this.jornadas[e].Fin=this.jornadas[e].Inicio;
                console.log("igualando horas de inicio...")
              } 
            }else{
              this.jornadas[e].Fin=h;
              console.log("-------")
              console.log(this.jornadas[e].Inicio)
              console.log(this.jornadas[e].Fin)
              console.log("---------------")
              if(this.jornadas[e].Fin<this.jornadas[e].Inicio){
                this.jornadas[e].Inicio=this.jornadas[e].Fin;
                console.log("igualando horas de fin...")
              } 
            }
            
            console.log("la hora:")
            console.log(this.jornadas[e].Inicio)
            console.log(this.jornadas[e].Fin)
          }
          
          
          
        }
        
        