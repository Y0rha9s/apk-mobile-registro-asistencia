import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';
import { Barcode,BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {
  
  [x: string]: any;
  usuario: string ='';
  contrasena: string = ''

  correo: string = '';
  nombre: string = '';
  apellido: string = '';

  asignatura: string = '';
  seccion: string = '';
  fecha: string = '';

  isSupported = false;
  barcodes: Barcode[] = []; 

  asistencia: any[] = [];
  intevalo: any;

  v_visiblePrincipal= false;
  v_labelusario: string = "";

  handlerefresh(event: any){
    setTimeout(() => {
      this.recargarPagina()
      event.target.complete();
    }, 500);
  }

  constructor(private loadingCtrl: LoadingController,private api: ApiService,private router: Router, private db: DbService,private alertController: AlertController) { }

  ngOnInit() {

    this.listarInfo();

    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });

    let extras = this.router.getCurrentNavigation();

    if(extras?.extras.state){
    this.usuario = extras?.extras.state['usuario'];
    this.contrasena = extras?.extras.state['contrasena'];
    }
    this.infoUsuario();
    console.log('CAGL: Usuario en principal: ' + this.usuario)
    console.log('CAGL: contraseña en principal: ' + this.contrasena)

    if(this.usuario == ''){
      console.log('Vacio');
      this.db.obtenerSession().then(data =>{
        this.usuario = data.usuario;
        this.contrasena = data.usuario;
        this.infoUsuario();
      })
    }else{
      this.infoUsuario();
    }
  }

  volverLogin(){
    let extras: NavigationExtras={
      state:{
        usuario: this.usuario,
        contrasena: this.contrasena
      },replaceUrl :true
    }
    this.router.navigate(['login'],extras);
  }

  infoUsuario(){
    this.db.infoUsuario(this.usuario, this.contrasena)
    .then(data => {
      this.correo = data.correo;
      this.nombre = data.nombre;
      this.apellido = data.apellido;
    })
  }

  navegarCambiarContrasena(){
    let extras: NavigationExtras = {
      state: {
        usuario: this.usuario,
        contrasena: this.contrasena
      },
      replaceUrl: true
    }
    this.router.navigate(['cambiar-contrasena'],extras);
  }

  cerrarSesion(){
    this.db.eliminarSesion();
    let extras: NavigationExtras = {
      replaceUrl: true
    }
    this.router.navigate(['login'],extras);
  }

  async scan(): Promise<void>{
    const ress = await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();

    if(!ress.available){
      await BarcodeScanner.installGoogleBarcodeScannerModule()
    }

    const granted = await this.requestPermissions();
    if(!granted){
      this.presentAlert()
      return;
    }

    const{ barcodes } = await BarcodeScanner.scan()

    this.procesarCodigoQR(barcodes);
    this.barcodes.push(...barcodes);
  }

  async  requestPermissions(): Promise<boolean>{
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void>{
    const alert = await this.alertController.create({
      header: 'Permission denied',
      message: 'Please grant camera permission to use barcode scanner.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  async listarInfo(){
    let result = this.api.asistenciaObtener(this.usuario);
    let respuesta = await lastValueFrom(result);

    let jsonTexto =  JSON.stringify(respuesta);
    let json = JSON.parse(jsonTexto);
    for (let x=0; x<json['result'].lenght;x++){
      this.asistencia.push(json['result'][x])
    }
    console.log(this.asistencia);
  }

  async deleteAsistencia(){
    let data = this.api.asistenciaEliminar(this.usuario);
    let respuesta = await lastValueFrom(data);
    let jsonTexto = JSON.stringify(respuesta);
    let json = JSON.parse(jsonTexto)
    this.showLoading();
    this.v_labelusario = 'Asistencia elimina'
    console.log('CAGL: eliinar asistencia: ' + JSON.stringify(json))
  }

  async procesarCodigoQR(barcodes: Barcode[]): Promise<void>{
    const qrInfo = barcodes[0];

    if(qrInfo){
      const rawData = qrInfo.rawValue;
      const dataArray = rawData.split('|');

      const usuario =  this.usuario;
      const asignatura =  dataArray[0];
      const seccion = dataArray[1];
      const fecha = dataArray[3];

      const asignaturaSplit = asignatura.split('-');
      const elementosDespuesGuion = asignaturaSplit.length > 1 ? asignaturaSplit.slice(1).join(',') : '';
      let expectedResponse = '{"result":[{"RESPUESTA":"ASISTENCIA_OK"}]}'

      try{
        let data = this.api.asistenciaAlmacenar(
          usuario,
          asignatura,
          elementosDespuesGuion,
          fecha
        );
        let respuesta = await lastValueFrom(data);
        let jsonTexto = JSON.stringify(respuesta);

        
        if (jsonTexto == expectedResponse){
          this.showLoading()
          this.v_labelusario = 'Queda presente'
        }else{
          this.showLoading()
          this.v_labelusario = 'ya se encuentra presente'
        }
        console.log('CAGL: DATOS: ' + usuario, 'asignatura:' + asignatura, 'seccion:' + seccion, 'fecha: ' + fecha);
        console.log('CAGL: RESPUESTA API: '+ jsonTexto);
      }catch(error){
        console.error('ERROR al llamer a la API: ',error);
      }
    }else {
      console.error('No se encontro informacion del codigo QR');
    }
  }

  recargarPagina(){
    clearInterval(this.intevalo);
    this.asistencia = [];
    this.listarInfo();
  }

  mostrarMensaje(){
    this.v_visiblePrincipal = true;
    setTimeout(() => {
      this.v_visiblePrincipal = false
    }, 4000);
  }

  async showLoading(){
    const loading = await this.loadingCtrl.create({
      message: 'validando...',
      duration: 2000,
      spinner: 'circles'
    });

    loading.present();
    loading.onDidDismiss().then(() => {
      this.mostrarMensaje();
    });
  }
}
