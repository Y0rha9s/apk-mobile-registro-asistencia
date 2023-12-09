import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(private sqlite: SQLite) { 
    this.crearTablas();
  }

  crearTablas(){
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql('create table if not exists usuario (usuario varchar(30), contrasena varchar(30), correo varchar(30), nombre varchar(30), apellido varchar(30))', [])
          .then(() => console.log('TXT: tabla usuario creada correctamente'))
          .catch(e => console.log('TXT: error al crear tabla usuario: '+ JSON.stringify(e)));
      })
      .catch(e => console.log('TXT: error al crear o acceder db'));

      this.sqlite.create({
        name: 'data.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          db.executeSql('create table if not exists sesion (usuario varchar(30), contrasena varchar(30))', [])
            .then(() => console.log('TXT: tabla sesion creada correctamente'))
            .catch(e => console.log('TXT: error al crear tabla sesion: '+ JSON.stringify(e)));
        })
        .catch(e => console.log('TXT: error al crear o acceder db'));
  }
  

  almacenarUsuario(usuario: string, contrasena: string, correo: string, nombre: string, apellido: string){
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql('insert into usuario values (? , ? , ? , ? , ? )', [usuario,contrasena,correo,nombre,apellido])
          .then(() => console.log('TXT: tabla usuario almacenado correctamente'))
          .catch(e => console.log('TXT: error al almacenar usuario: '+ JSON.stringify(e)));
      })
      .catch(e => console.log('TXT: error al crear o acceder db'));
  }

  almacenarSesion(usuario: string, contrasena: string){
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql('insert into sesion values (? , ?)', [usuario,contrasena])
          .then(() => console.log('TXT: tabla sesion almacenado correctamente'))
          .catch(e => console.log('TXT: error al almacenar sesion: '+ JSON.stringify(e)));
      })
      .catch(e => console.log('TXT: error al crear o acceder db'));
  }

  eliminarSesion(){
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql('delete from sesion', [])
          .then(() => console.log('TXT: sesion eliminada correctamente'))
          .catch(e => console.log('TXT: error al eliminada sesion: '+ JSON.stringify(e)));
      })
      .catch(e => console.log('TXT: error al crear o acceder db'));
  }

  loginUsuario(usuario: string, contrasena: string){
    return this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        return db.executeSql('select count(usuario) as cantidad from usuario where usuario = ? and contrasena = ?', [usuario,contrasena])
          .then((data) => {
            return data.rows.item(0).cantidad;
          })
          .catch(e => console.log('TXT: error al logear usuario: '+ JSON.stringify(e)));
      })
      .catch(e => console.log('TXT: error al crear o acceder db'));
  }

  validarSesion(){
    return this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        return db.executeSql('select count(usuario) as cantidad from sesion', [])
          .then((data) => {
            return data.rows.item(0).cantidad;
          })
          .catch(e => console.log('TXT: error al realizar sesion: '+ JSON.stringify(e)));
      })
      .catch(e => console.log('TXT: error al crear o acceder db'));
  }

  infoUsuario(usuario: string, contrasena: string){
    return this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        return db.executeSql('select correo, nombre, apellido from usuario where usuario = ? and contrasena = ?', [usuario,contrasena])
          .then((data) => {
            let objeto: any={}
              objeto.nombre = data.rows.item(0).nombre;
              objeto.correo = data.rows.item(0).correo;
              objeto.apellido = data.rows.item(0).apellido;

            return objeto
          })
          .catch(e => console.log('TXT: error al Obtener info de  usuario: '+ JSON.stringify(e)));
      })
      .catch(e => console.log('TXT: error al crear o acceder db'));
  }

  obtenerSession(){
    return this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject)=> {
      return db.executeSql('select usuario, contraseña from sesion',[])
        .then((data)=>{
          let objeto: any = {};
          objeto.usuario=data.rows.item(0).usuario;
          objeto.contrasena=data.rows.item(0).contrasena;
          return objeto;
        })
        .catch(e => console.log('CAGL: Error al obtener sesion'+ JSON.stringify(e)));
    })
    .catch(e => console.log('CAGL: error al crear o abrir DB'+JSON.stringify(e)));
  }

  cambiarContrasena(usuario: string, contrasenaActual: string , contrasenaNueva: string){
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        db.executeSql('update usuario set contrasena = ? where usuario =? and contrasena =?', [contrasenaNueva,usuario,contrasenaActual])
          .then(() => console.log('TXT: tabla usuario actualizado correctamente'))
          .catch(e => console.log('TXT: error al actualizar datos usuario: '+ JSON.stringify(e)));
      })
      .catch(e => console.log('TXT: error al crear o acceder db'));
  }
}
