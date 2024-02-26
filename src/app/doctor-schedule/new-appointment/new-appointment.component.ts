import { Component,OnInit } from '@angular/core';
import { HttpClient, HttpParams,HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { storageService } from 'src/app/storage.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-new-appointment',
  templateUrl: './new-appointment.component.html',
  styleUrls: ['./new-appointment.component.css']
})
export class NewAppointmentComponent implements OnInit {
  name: string;
  lastname: string;
  lastname2: string;
  phonenumber: string;
  age: string;
  email: string;
  date:string;
  datebirth:string;
  treatment:string;
  availableDates: any[] = [];
  selectedHour: number;
  treatments: any[] = [];

  constructor(private http:HttpClient, private route:Router, private storage:storageService) {
    this.name = '';
    this.lastname = '';
    this.lastname2 = '';
    this.phonenumber = '';
    this.age = '';
    this.email = '';
    this.date='';
    this.datebirth='';
    this.treatment='';
    this.selectedHour=0;
  }
  
  ngOnInit(): void {
    this.storage.clearAllDataItems();
    this.tratamientos();
  }
  
  disponibles() {
    const url = 'https://doctorappbackend-wpqd.onrender.com/schedules/availableDates';

    const params = new HttpParams()
      .set('idDoctor', 19)
      .set('fecha',this.formatdate(this.date) );
      this.http.get(url, { params }).subscribe(
        (response: any) => {
          if (response && response.availableDates) {
            this.availableDates = response.availableDates;
            console.log(this.availableDates);
          } else {
            console.error('Error:', response);
          }
        },
        (error) => {
          console.error('Error:', error);
        }
      );
  
  }
  formatdate(date:string ):string{
    const dateObj = new Date(date);

    // Obtén los componentes de la fecha (año, mes, día)
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Ajusta para que siempre tenga dos dígitos
    const day = dateObj.getDate().toString().padStart(2, '0'); // Ajusta para que siempre tenga dos dígitos
    
    // Crea la cadena de fecha en el formato deseado (YYYY/MM/DD)
    return `${year}-${month}-${day}`;
  }
  formatHora(segundos: number): string {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);

    return `${this.agregarCero(horas)}:${this.agregarCero(minutos)}`;
  }

  agregarCero(valor: number): string {
    return valor < 10 ? `0${valor}` : `${valor}`;
  }
  onSelect(date: any): void {
    if (this.selectedHour === date.hora) {
      // Si vuelves a seleccionar la misma hora
      this.selectedHour = 0;
    } else {
      //selecciona la nueva hora
      this.selectedHour = date.hora;
    }
  }
  getButtonClass(date: any): string {
    return this.selectedHour === date.hora ? 'btn btn-danger' : 'btn btn-danger-outline';
  }

  tratamientos() {

    const url = 'https://doctorappbackend-wpqd.onrender.com/treatments/treatments';

    const params = new HttpParams()
      .set('idDoctor', 19);
      this.http.get(url, { params }).subscribe(
        (response: any) => {
          if (response && response.treatments) {
            this.treatments = response.treatments;
            console.log(response.treatments);
          } else {
            console.error('Error:', response);
          }
        },
        (error) => {
          console.error('Error:', error);
        }
      );
  
  }
  agendar(){
    if(!this.phonenumber||!this.name||!this.lastname||!this.lastname2||!this.age||!this.email||!this.date||!this.datebirth){
      Swal.fire({
    
        text: 'Faltan datos por llenar',
        icon: 'error',
      
      })
      //alert("Campos vacios");
    }else{

    
      const url = `https://doctorappbackend-wpqd.onrender.com/dates/setDate?celular=${this.phonenumber}&correo=${this.email}&Nombre=${this.name}&PrimerApe=${this.lastname}&SegundoApe=${this.lastname2}&idTratamiento=${this.treatment}&idDoctor=19&edad=${this.age}&fechanac=${this.formatdate(this.datebirth)}&fecha=${this.formatdate(this.date)}&hora=${String(this.formatHora(this.selectedHour))}`;
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'accept': 'application/json'
       });
    // Realiza la solicitud POST
    this.http.post(url, {headers}).subscribe(
      (response: any) => {
        console.log('Solicitud POST exitosa:', response);
        Swal.fire({
    
          text: 'Cita agregada',
          icon: 'success',
        
        }).then((result) => {
          if (result.isConfirmed) {
            // Si el usuario hace clic en "Aceptar", cierra la ventana
            window.close();
          }
        });
        //alert("Cita agregada");
        //this.route.navigate(['/schedule/scheduleview']);
        this.phonenumber='';
        this.name='';
        this.lastname='';
        this.lastname2='';
        this.treatment='';
        this.email='';
        this.age='';
        this.datebirth='';
        this.date='';
        // Manejar la respuesta según tus necesidades
      },
      (error) => {
        console.error('Error en la solicitud POST:', error);
      }
    );

    }
  }
}
