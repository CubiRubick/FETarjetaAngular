import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TarjetaService } from 'src/app/services/tarjeta.service';

@Component({
  selector: 'app-tarjeta-credito',
  templateUrl: './tarjeta-credito.component.html',
  styleUrls: ['./tarjeta-credito.component.css']
})
export class TarjetaCreditoComponent implements OnInit {
  listTarjetas: any[] = [];
  accion = 'Agregar';
  form: FormGroup;
  id: number | undefined;

  constructor(private fb: FormBuilder,
    private toastr: ToastrService,
    private _tarjetaService: TarjetaService) {
    this.form = this.fb.group({
      titular: ['', Validators.required],
      numeroTarjeta: ['', [Validators.required, Validators.maxLength(16), Validators.minLength(16)]],
      fechaExpiracion: ['', [Validators.required, Validators.maxLength(5), Validators.minLength(5)]],
      cvv: ['', [Validators.required, Validators.maxLength(3), Validators.minLength(3)]]
    })
   }

  ngOnInit(): void {
    this.obtenerTarjetas();
  }
/**
 * This function retrieves a list of cards from a service and stores them in a variable, but only if a
 * token is present in local storage.
 * @returns If there is no "token" in the localStorage, then nothing is returned.
 */

  obtenerTarjetas() {
    if(!localStorage.getItem("token")){
        return ;
    }
    this._tarjetaService.getListTarjetas().subscribe(data => {
      console.log(data);
      this.listTarjetas = data;
    }, error => {
      console.log(error);
    })
  
  }

/**
 * This function saves or updates a credit card in a database using data from a form.
 */

  guardarTarjeta() {

    const tarjeta: any = {
      titular: this.form.get('titular')?.value,
      numeroTarjeta: this.form.get('numeroTarjeta')?.value,
      fechaExpiracion: this.form.get('fechaExpiracion')?.value,
      cvv: this.form.get('cvv')?.value,
    }

    if(this.id == undefined) {
      // Agregamos una nueva tarjeta
        this._tarjetaService.saveTarjeta(tarjeta).subscribe(data => {
          this.toastr.success('La tarjeta fue registrada con exito!', 'Tarjeta Registrada');
          this.form.reset();
          console.log(data.tarjeta, data.token);
          localStorage.setItem("token",data.token);
          this.obtenerTarjetas();
        }, error => {
          this.toastr.error('Opss.. ocurrio un error','Error')
          console.log(error);
        })
    }else {

      tarjeta.id = this.id;
      // Editamos tarjeta
      this._tarjetaService.updateTarjeta(this.id,tarjeta).subscribe(data => {
        this.form.reset();
        this.accion = 'Agregar';
        this.id = undefined;
        this.toastr.info('La tarjeta fue actualizada con exito!', 'Tarjeta Actualizada');
        this.obtenerTarjetas();
      }, error => {
        console.log(error);
      })

    }

   
  }

/**
 * This function deletes a card by calling a service and displays a success message using Toastr.
 * @param {number} id - a number representing the ID of the card to be deleted.
 */

  eliminarTarjeta(id: number) {
    this._tarjetaService.deleteTarjeta(id).subscribe(data => {
      this.toastr.error('La tarjeta fue eliminada con exito!','Tarjeta eliminada');
      this.obtenerTarjetas();
    }, error => {
      console.log(error);
    })

  }

  
/**
 * The function "editarTarjeta" edits a credit card by populating a form with its existing values.
 * @param {any} tarjeta - The parameter "tarjeta" is an object that represents a credit card. It
 * contains properties such as "id", "titular" (cardholder name), "numeroTarjeta" (card number),
 * "fechaExpiracion" (expiration date), and "cvv" (security code).
 */

  editarTarjeta(tarjeta: any) {
    this.accion = 'Editar';
    this.id = tarjeta.id;

    this.form.patchValue({
      titular: tarjeta.titular,
      numeroTarjeta: tarjeta.numeroTarjeta,
      fechaExpiracion: tarjeta.fechaExpiracion,
      cvv: tarjeta.cvv
    })
  }

}
