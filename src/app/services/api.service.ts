import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  httpOptions={
    headers: new HttpHeaders({
      'Content-Type':'application/json',
      'Access-Control-Allow-Origin':'*'
    })
  }

  ruta = 'https://fer-sepulveda.cl/API_PRUEBA_2/api-service.php';
  rutaQR = 'https://fer-sepulveda.cl/API_PRUEBA_3/api-service.php'
  constructor(private http:HttpClient){}

  almacenarPersonaApi(usuario: string, correo: string, nombre: string, apellido: string, contrasena: string){
    return this.http.post(this.ruta,{
      nombreFuncion: 'UsuarioAlmacenar',
      parametros: [
        usuario, correo,contrasena,nombre,apellido
      ]
    }).pipe();
  }

  personaLogin(usuario: string, contrasena: string){
    return this.http.post(this.ruta,{
      nombreFuncion: 'UsuarioLogin',
      parametros: {
        usuario,contrasena
      }
    }).pipe();
  }

  personaModificarContrasena(usuario: string, contrasenaNueva: string, contrasenaActual:string){
    return this.http.patch(this.ruta,{
      nombreFuncion: 'UsuarioModificarContrasena',
      parametros: [
        usuario, contrasenaNueva,contrasenaActual
      ]
    }).pipe();
  }

  asistenciaAlmacenar(usuario: string, asignatura: string, seccion: string, fecha: string){
    return this.http.post(this.rutaQR, {
      nombreFuncion: "AsistenciaAlmacenar",
      parametros: [
        usuario,asignatura,seccion,fecha
      ]
    }).pipe();
  }

  asistenciaObtener(usuario: string){
    return this.http.get(this.rutaQR + '?nombreFuncion=AsistenciaObtener&usuario=' + usuario).pipe();
  }
  
  asistenciaEliminar(usuario: string){
    return this.http.get(this.rutaQR + '?nombreFuncion=AsistenciaEliminar&usuario=' + usuario).pipe();
  }
}
