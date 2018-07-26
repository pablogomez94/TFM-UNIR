import { Component, OnInit } from '@angular/core';
import {UserHttp} from '../http/user';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable } from 'rxjs/Observable';
import{Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  err:boolean=false;
  errmsg:string=""
  userhttp:UserHttp=new UserHttp(this.http)
  user:string="";
  pass:string="";
  cargando=false;
  constructor(public http: HttpClient,private router: Router) { }
  
  ngOnInit() {
  }
  
  Login(){
    //se realiza la petición al servidor pasándole el usuario y la contraseña
    this.userhttp.PostUser(this.user,this.pass).subscribe(
      exito=>{
        //en caso de exito, se almacena en una variable de sesión el token cifrado 
        //y se va a la página principal
        sessionStorage.setItem("token",exito.token);
        this.router.navigate(["fichar"]);
      },
      error=>{
        console.log(error.status);
        if(error.status==401){
          //si el error es 401, las credenciales no son correctas
          //se configura el mensaje de error:
          this.err=true;
          this.errmsg="El usuario o la contraseña, son incorrectas"
          this.pass="";
        }else{
          //si el error es 500, se ha producido un error en el servidor
          //se configura el mensaje de error:
          this.err=true;
          this.errmsg="Se ha producido un error de conexión con la aplicación"
          this.pass="";
        }
        setTimeout(() => 
        {
            this.err=false;//Oculta de nuevo el mensaje de error
        },
        4000);
        
      }
    );
  }
  
  
  
}
