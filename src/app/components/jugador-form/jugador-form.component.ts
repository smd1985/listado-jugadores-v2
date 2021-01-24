import { Component, OnInit, HostBinding } from '@angular/core';
import { Jugador } from 'src/app/models/Jugador';

import { JugadoresService } from 'src/app/services/jugadores.service';
import { Router, ActivatedRoute } from '@angular/router';

interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-jugador-form',
  templateUrl: './jugador-form.component.html',
  styleUrls: ['./jugador-form.component.css']
})
export class JugadorFormComponent implements OnInit {

  //fotos
  photoSelected: string | ArrayBuffer;
  file: File;
  //finfotos

  @HostBinding('class') clases = 'row';

  jugador: Jugador = {
    id: 0,
    nombre: '',
    posicion: '',
    equipo:'',
    nacionalidad:'',
    imagen:new File([],"img"),
    fecha_creacion: new Date()
  };

  edit: boolean = false;

  constructor(private jugadorService: JugadoresService, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  //funcion para leer imagen seleccionada
  onPhotoSelected(event: HtmlInputEvent): void {
    if (event.target.files && event.target.files[0]) {
      this.file = <File>event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.photoSelected = reader.result;
      console.log("foto es222: "+JSON.stringify(this.file))
      reader.readAsDataURL(this.file);
    }
  }
  //finfotos

  ngOnInit() {
    
    const params = this.activatedRoute.snapshot.params;

    if (params.id) {
      this.jugadorService.getJugador(params.id)
        .subscribe(
          res => {
            this.photoSelected = 'http://localhost:3000/' + params.imagen;
            this.jugador = res;
            this.edit = true;
          },
          err => console.log(err)
        )
    }
  }

  guardarJugador() {
    delete this.jugador.fecha_creacion;
    delete this.jugador.id;

    const fd = new FormData();
    fd.append('nombre',this.jugador.nombre);
    fd.append('equipo',this.jugador.equipo);
    fd.append('posicion',this.jugador.posicion);
    fd.append('nacionalidad',this.jugador.nacionalidad);
    fd.append('imagen',this.file)

    this.jugadorService.saveJugador(fd)
      .subscribe(
        res => {
          console.log(res);
          this.router.navigate(['/jugadores']);
        },
        err => console.error(err)
      )
  }

  updateJugador() {
    
    delete this.jugador.fecha_creacion;
    const rf = new FormData();

    rf.append('nombre',this.jugador.nombre);
    rf.append('equipo',this.jugador.equipo);
    rf.append('posicion',this.jugador.posicion);
    rf.append('nacionalidad',this.jugador.nacionalidad);
    rf.append('imagen',this.file)

    this.jugadorService.updateJugador(this.jugador.id, rf)
      .subscribe(
        res => { 
          console.log(res);
          this.router.navigate(['/jugadores']);
        },
        err => {
          console.log("se ha producido un error al actualizar el jugador")
          console.error(err)
        }
      )
  }

}
