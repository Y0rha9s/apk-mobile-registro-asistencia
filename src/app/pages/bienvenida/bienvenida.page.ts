import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.page.html',
  styleUrls: ['./bienvenida.page.scss'],
})
export class BienvenidaPage implements OnInit {

  constructor(private db: DbService, private router: Router) { }

  ngOnInit() {
    setTimeout(() => {
      this.db.validarSesion().then(data => {
        if (data == 0) {
          this.router.navigate(['login'])
        } else {
          this.router.navigate(['principal'])
        }
      })
    },2000);
  }
}
