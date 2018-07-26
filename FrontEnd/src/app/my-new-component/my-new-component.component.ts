import { Component, OnInit } from '@angular/core';
import{Cliente} from '../models/Cliente';
import{Evento} from '../models/Evento';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'app-my-new-component',
  templateUrl: './my-new-component.component.html',
  styleUrls: ['./my-new-component.component.css']
})
export class MyNewComponentComponent implements OnInit {
 
  usuario:string="a";
  contrasenia:string="as";
  constructor(public http: HttpClient) {
    }
 
  ngOnInit() {
   
     }

     enviar(){
       console.log(this.usuario +"-"+this.contrasenia);
       this.login().subscribe(
         exito=>{
           console.log(exito)
         },
         error=>{
           console.log(error)
         }
       )
     }
     
    login():Observable<any>{
      let json = JSON.stringify({"user":"pablo","pass":"contrasenia"});
      let params = json;
      let headers = new HttpHeaders().set('Content-Type','application/json');
      return this.http.post("http://localhost:3678"+"/api/ObtenerToken", params, {headers: headers});
    }
}

