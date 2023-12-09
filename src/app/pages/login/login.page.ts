import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { DbService } from 'src/app/services/db.service';
import { lastValueFrom } from 'rxjs';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  mdl_usuario: string = '';
  mdl_contrasena: string = '';

  v_labelUser: string = "";
  v_visbleLogin = false;

  constructor(private router: Router, private db: DbService,private api:ApiService,private loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  /*ingresar(){
    let extras: NavigationExtras = {
      replaceUrl: true,
      state: {
        usuario: this.mdl_usuario,
        contrasena: this.mdl_contrasena
      }
    }
    this.router.navigate(['principal'], extras);
  }*/

  navegarCrearUsuario(){
    this.router.navigate(['crear-usuario'])
  }

  login(){
    let extras: NavigationExtras = {
      replaceUrl: true,
      state: {
        usuario: this.mdl_usuario,
        contrasena: this.mdl_contrasena
      }
    }
    this.db.loginUsuario(this.mdl_usuario, this.mdl_contrasena)
    .then(data => {
      if(data == 1){
        this.db.almacenarSesion(this.mdl_usuario,this.mdl_contrasena)
        this.router.navigate(['principal'],extras);
      }else {
        this.showLoading()

        this.v_labelUser = 'credenciales invalides o registrese por favor'
        console.log('CAGL: credenciales invalidas');
      }this.personaLoginApi()
    }).catch(e=>{(console.log(e))})
  }

  async personaLoginApi(){
    try{
      let data = this.api.personaLogin(
        this.mdl_usuario,
        this.mdl_contrasena);
        let respuesta =  await lastValueFrom(data);

        let jsonTexto = JSON.stringify(respuesta);
          console.log('CAGL: API LOGIN' + jsonTexto)
    }catch (error){
      console.error('CAGL: Error en persona login api',error)
    }
  }

  mostrarMensaje(){
    this.v_visbleLogin = true;
    setTimeout(() => {
      this.v_visbleLogin = false
    }, 4000);
  }

  async showLoading(){
    const loading = await this.loadingCtrl.create({
      message: 'Validando credenciales...',
      duration: 3000,
      spinner: 'circles'
    });

    loading.present();
    loading.onDidDismiss().then(() => {
      this.mostrarMensaje();
    });
  }
}
