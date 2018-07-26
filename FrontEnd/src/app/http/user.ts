import {HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable } from 'rxjs/Observable';
import { RequestOptions } from '@angular/http/src/base_request_options';


export class UserHttp {
  ip="http://localhost"
  constructor(public http: HttpClient) { }
  
  borrarHorario(token,horario){
    let headers = new HttpHeaders();
    headers=headers.append('Content-Type','application/json');
    headers=headers.append('x-access-token',token);
    return this.http.delete(this.ip+"/api/borrarHorario/"+horario,{headers:headers});
  }
  
  existsUser(token,user):Observable<any>{
    let headers = new HttpHeaders();
    headers=headers.append('Content-Type','application/json');
    headers=headers.append('x-access-token',token);
    return this.http.get(this.ip+"/api/existsUser/"+user,{headers:headers});
  }
  
  UpdateUser(token,user:string,pass:string,rol:number,nombre:string,id:number):Observable<any>{
    let json = JSON.stringify({"user":user,"pass":pass,"rol":rol,"nombre":nombre,"id":id});
    let params = json;
    let headers = new HttpHeaders().set('Content-Type','application/json');
    headers=headers.append('x-access-token',token);
    return this.http.put(this.ip+"/api/updateUser", params, {headers: headers});
  }
  
  InsertUser(token,user:string,pass:string,rol:number,horario:number,nombre:string):Observable<any>{
    let json = JSON.stringify({"user":user,"pass":pass,"rol":rol,"horario":horario,"nombre":nombre});
    let params = json;
    let headers = new HttpHeaders().set('Content-Type','application/json');
    headers=headers.append('x-access-token',token);
    return this.http.post(this.ip+"/api/createUser", params, {headers: headers});
  }
  
  DeleteUser(token,id:number):Observable<any>{
    let json = JSON.stringify({"user":id});
    let params = json;
    let headers = new HttpHeaders().set('Content-Type','application/json');
    headers=headers.append('x-access-token',token);
    return this.http.post(this.ip+"/api/deleteUser", params, {headers: headers});
  }
  
  
  PostUser(user:string,pass:string):Observable<any>{
    let json = JSON.stringify({"user":user,"pass":pass});
    let params = json;
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this.http.post(this.ip+"/api/ObtenerToken", params, {headers: headers});
  }
  
  
  PostHorario(token,horario,values):Observable<any>{
    let json = JSON.stringify({"horario":horario,"values":values});
    let params = json;
    let headers = new HttpHeaders().set('Content-Type','application/json');
    headers=headers.append('x-access-token',token);
    return this.http.post(this.ip+"/api/insertHorario", params, {headers: headers});
  }
  
  UpdateHorario(token,horario,values,id):Observable<any>{
    let json = JSON.stringify({"horario":horario,"values":values,"horarioID":id});
    let params = json;
    let headers = new HttpHeaders().set('Content-Type','application/json');
    headers=headers.append('x-access-token',token);
    return this.http.put(this.ip+"/api/updateHorario", params, {headers: headers});
  }
  
  horarioBorrable(token,horario):Observable<any>{
    console.log("HORARIO"+horario)
    let headers = new HttpHeaders();
    headers=headers.append('Content-Type','application/json');
    headers=headers.append('x-access-token',token);
    return this.http.get(this.ip+"/api/borrable/"+horario,{headers:headers});
  }
  
  
  
  PostFichaje(fichaje,token:string):Observable<any>{
    let json = JSON.stringify(fichaje);
    let params = json;
    let headers = new HttpHeaders();
   
    headers=headers.append('Content-Type','application/json');
    headers=headers.append('x-access-token',token);
    console.log(params);
    console.log(token);
   
    return this.http.post(this.ip+"/api/insertFichaje", params, {headers: headers});
  }
  
  UpdateToken(token):Observable<any>{
    console.log("update token")
    console.log(token);
    let headers = new HttpHeaders();
    headers=headers.append('Content-Type','application/json');
    headers=headers.append('x-access-token',token);
    
    return this.http.put(this.ip+"/api/UpdateToken",{}, {headers: headers});
  }
  
  
  getEvents():Observable<any>{
    return this.http.get(this.ip+"/api/eventos")
  }
  
  getUsers(token):Observable<any>{
    let headers = new HttpHeaders();
    headers=headers.append('Content-Type','application/json');
    headers=headers.append('x-access-token',token);
    return this.http.get(this.ip+"/api/getUsers",{headers:headers});
  }
  getInfoUsers(token):Observable<any>{
    let headers = new HttpHeaders();
    headers=headers.append('Content-Type','application/json');
    headers=headers.append('x-access-token',token);
    return this.http.get(this.ip+"/api/getInfoUsers",{headers:headers});
  }
  
  getFichajes(token):Observable<any>{
    let headers = new HttpHeaders();
    headers=headers.append('Content-Type','application/json');
    headers=headers.append('x-access-token',token);
    return this.http.get(this.ip+"/api/getFichajesJornada",{headers: headers});
  }
  
  getFichajesUser(FIni,FFin,User,token):Observable<any>{
    let headers = new HttpHeaders();
    headers=headers.append('Content-Type','application/json');
    headers=headers.append('x-access-token',token);
    return this.http.get(this.ip+"/api/getFichajesUser/"+FIni+"/"+FFin+"/"+User+"",{headers: headers});
  }
  
  getFichajesUserOnly(FIni,FFin,token):Observable<any>{
    let headers = new HttpHeaders();
    headers=headers.append('Content-Type','application/json');
    headers=headers.append('x-access-token',token);
    return this.http.get(this.ip+"/api/getFichajesUserOnly/"+FIni+"/"+FFin+"/",{headers: headers});
  }
  
  getHorarios(token):Observable<any>{
    let headers = new HttpHeaders();
    headers=headers.append('Content-Type','application/json');
    headers=headers.append('x-access-token',token);
    return this.http.get(this.ip+"/api/gethorarios",{headers: headers});
  }
  
  getJornadas(token,horario):Observable<any>{
    let headers = new HttpHeaders();
    headers=headers.append('Content-Type','application/json');
    headers=headers.append('x-access-token',token);
    
    return this.http.get(this.ip+"/api/getJornadas/" +horario,{headers: headers});
  }
  
  
  isLogged(admin,token){
    let headers = new HttpHeaders();
    headers=headers.append('Content-Type','application/json');
    headers=headers.append('x-access-token',token);
    
    return this.http.get(this.ip+"/api/islogged/" + admin,{headers: headers});
  }
  
  esJornada(token){
    let headers = new HttpHeaders();
    headers=headers.append('Content-Type','application/json');
    headers=headers.append('x-access-token',token);
   
    return this.http.get(this.ip+"/api/esJornada",{headers: headers});
  }
}