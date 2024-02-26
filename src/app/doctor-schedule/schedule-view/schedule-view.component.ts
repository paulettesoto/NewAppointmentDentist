import { Component,OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { storageService } from 'src/app/storage.service';
import * as jsPDF from 'jspdf';

@Component({
  selector: 'app-schedule-view',
  templateUrl: './schedule-view.component.html',
  styleUrls: ['./schedule-view.component.css']
})
export class ScheduleViewComponent implements OnInit {
  currentDate: Date;
  name: string;
  lastname: string;
  lastname2: string;
  date: string;
  dates: any[] = [];
  datesR: any[] = [];
  page=1;
  pages=1;
  paged=2;

  
  paginador(i:number){
    let r:Number;
    this.page=this.page+i;
    r=this.page;
    if(r==0){
      this.page=1;
    }
    if(r==(this.pages+1)){
      this.page=(this.pages);
    }

  }
  ngOnInit(): void {
    this.datelist();
  }
  constructor(private http:HttpClient, private storage:storageService) {
    this.name = '';
    this.lastname = '';
    this.lastname2 = '';
    this.date = '';
    this.currentDate = new Date();
  }
  formatHora(segundos: number): string {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);

    return `${this.agregarCero(horas)}:${this.agregarCero(minutos)}`;
  }

  agregarCero(valor: number): string {
    return valor < 10 ? `0${valor}` : `${valor}`;
  }
//CURDATE()
  datelist() {
    const url = 'https://doctorappbackend-wpqd.onrender.com/dates/dates';
    console.log(this.formatdate(this.currentDate.toDateString()));
  
      const params = new HttpParams()
        .set('idDoctor', this.storage.getDataItem('user'))
        .set('fecha', this.formatdate(this.currentDate.toDateString()));
        ;
        this.http.get(url, { params }).subscribe(
          (response: any) => {
            if (response && response.dates) {
              this.dates = response.dates;
              console.log(response.dates);
            } else {
              console.error('Error:', response);
            }
          },
          (error) => {
            console.error('Error:', error);
          }
        );
  
  }
  verificarFechaPasada(fechaAComparar:any, hour:any): boolean {
    const fechaActual: Date = new Date();
    const year = fechaActual.getFullYear(); // Obtener el año
    const month = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Obtener el mes (se suma 1 porque los meses comienzan desde 0)
    const day = fechaActual.getDate().toString().padStart(2, '0'); // Obtener el día

    const fechaEnFormatoAAAAMMDD = `${year}-${month}-${day}`;
    const hours = fechaActual.getHours().toString().padStart(2, '0'); // Obtener la hora (asegurando que tenga dos dígitos)
    const minutes = fechaActual.getMinutes().toString().padStart(2, '0'); // Obtener los minutos (asegurando que tenga dos dígitos)

    const horaEnFormatoHHMM = `${hours}:${minutes}`;
    console.log(fechaAComparar)
    console.log(fechaEnFormatoAAAAMMDD)
    console.log(hour)
      console.log(horaEnFormatoHHMM)
    if (fechaAComparar < fechaEnFormatoAAAAMMDD) {
      console.log(fechaAComparar)
      console.log(fechaEnFormatoAAAAMMDD)
      return true;
    } else if (hour< horaEnFormatoHHMM) {
      console.log(hours)
      console.log(horaEnFormatoHHMM)
      return true;
    } else {
      return false;
    }
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
  search(){

    const url = 'https://doctorappbackend-wpqd.onrender.com/dates/dates';
      const params = new HttpParams()
        .set('idDoctor', this.storage.getDataItem('user'))
        .set('fecha',this.formatdate(this.date));
        ;
        console.log(this.storage.getDataItem('user'));
        console.log(this.formatdate(this.date));
        this.http.get(url, { params }).subscribe(
          (response: any) => {
            console.log(response);
            if (response && response.dates) {
              this.dates = response.dates;
              this.pages=Math.ceil(this.dates.length/this.paged);
              console.log(response.dates);
            } else {
              console.error('Error:', response);
            }
          },
          (error) => {
            console.error('Error:', error);
          }
        );

  }

  canceldate(id: any){
    const url = 'https://doctorappbackend-wpqd.onrender.com/dates/cancelDate';
  
      const params = new HttpParams()
        .set('idCita', id);
        ;
        this.http.delete(url, { params }).subscribe(
          (response: any) => {
            if (response && response.success) {
              console.log("Cita cancelada");
                this.search();
            } else {
              console.error('Error:', response);
            }
          },
          (error) => {
            console.error('Error:', error);
          }
        );
  

  }
  calificar(celular:any){
    const encodeurl = encodeURI(`https://commentsdentistapp.onrender.com`)
    const msg = `¡Hola!, Califica tu visita ${encodeurl}.`;
    const url = `https://doctorappbackend-wpqd.onrender.com/sendMessage/sendMessage?phoneN=${celular}&text=${msg}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'accept': 'application/json'
     });
    // Realiza la solicitud POST
    this.http.post(url, {headers}).subscribe(
      (response: any) => {
        console.log('Solicitud POST exitosa:', response);
        window.open(response.success, '_blank');
      },
      (error) => {
        console.error('Error en la solicitud POST:', error);
      }
    );

  }
  message(idpaciente:any, paciente:any, fecha:any, hora:any, dr:any, idcita:any, celular:any){
    const encodeurl = encodeURI(`https://doctorappbackend-wpqd.onrender.com/dates/confirmAppointment?idCita=${idcita}`)
    const encodeurl2 = encodeURI(`https://clinicalrecorddentistapp.onrender.com?id=${idpaciente}`)
    const msg = `¡Hola ${paciente}! Te recuerdo tu cita el dia ${fecha} a las ${this.formatHora(hora)} con Dra. ${dr}. En caso de cancelacion o quieras reagendar tu cita, favor de contactarnos con anticipacion. Excelente dia. Confirma tu cita dando click al siguiente enlace ${encodeurl}. Contesta las siguientes preguntas con tus datos reales ${encodeurl2}.`;
    const url = `https://doctorappbackend-wpqd.onrender.com/sendMessage/sendMessage?phoneN=${celular}&text=${msg}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'accept': 'application/json'
     });
    // Realiza la solicitud POST
    this.http.post(url, {headers}).subscribe(
      (response: any) => {
        console.log('Solicitud POST exitosa:', response);
        window.open(response.success, '_blank');
      },
      (error) => {
        console.error('Error en la solicitud POST:', error);
      }
    );
  }


  generatePDFWeek() {
    const url = 'https://doctorappbackend-wpqd.onrender.com/dates/reportWeek';

    const params = new HttpParams()
    .set('idDoctor', this.storage.getDataItem('user'))
    .set('fecha', this.formatdate(this.currentDate.toDateString()));

    this.http.get(url, { params }).subscribe(
      (response: any) => {
        if (response && response.dates) {
          this.datesR = response.dates;
          console.log(response.dates);

          const doc = new jsPDF.jsPDF();
          //membrete
          const imagePath = '../../assets/logo-removebg.png';
          const xCoordinate = 80;
          const yCoordinate = 10;
          const imageWidth = 60;  // Ancho de la imagen en mm
          const imageHeight = 30;  // Alto de la imagen en mm
          doc.addImage(imagePath, 'PNG', xCoordinate, yCoordinate, imageWidth, imageHeight);

          // Agregar contenido al PDF
          doc.setFont('bold');
          doc.setFontSize(18);
          doc.text('Agenda semanal', 90, 50);
          doc.setFont('normal');
          doc.setFontSize(12);
       
         // doc.text(`Dr: ${this.storage.getDataItem("nombre")} ${this.storage.getDataItem("apellido1")} ${this.storage.getDataItem("apellido2")}`, 20, 40);

          let yPosition = 60;

          this.datesR.forEach((date: any) => {
           // Calcular la altura del bloque de texto
            const blockHeight = 22; // Ajusta la altura del bloque según tus necesidades

            // Dibujar el borde
            doc.rect(20, yPosition, 170, blockHeight); // 20: posición x, yPosition: posición y, 150: ancho del bloque, blockHeight: altura del bloque

            // Agregar el texto dentro del borde
            doc.text(`Fecha y hora: ${date.fecha}  ${this.formatHora(date.hora)}`, 25, yPosition + 5);
            doc.text(`Paciente: ${date.Nombre} `, 25, yPosition + 10);
            doc.text(`Celular: ${date.Celular}  `, 25, yPosition + 15);
            doc.text(`Tratamiento: ${date.tratamiento}  `, 25, yPosition + 20);

            // Incrementar la posición vertical para el siguiente bloque de texto
            yPosition += blockHeight + 5; // Ajusta el espaciado según tus necesidades
          });

          // Guardar o mostrar el PDF (puedes personalizar esto según tus necesidades)
          doc.save('reporte.pdf');
        } else {
          console.error('Error:', response);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  generatePDFmonth() {
    const url = 'https://doctorappbackend-wpqd.onrender.com/dates/reportMonth';

    const params = new HttpParams()
    .set('idDoctor', this.storage.getDataItem('user'));

    this.http.get(url, { params }).subscribe(
      (response: any) => {
        if (response && response.dates) {
          this.datesR = response.dates;
          console.log(response.dates);

          const doc = new jsPDF.jsPDF();

          // Agregar contenido al PDF
              //membrete
          const imagePath = '../../assets/logo-removebg.png';
          const xCoordinate = 80;
          const yCoordinate = 10;
          const imageWidth = 60;  // Ancho de la imagen en mm
          const imageHeight = 30;  // Alto de la imagen en mm
          doc.addImage(imagePath, 'PNG', xCoordinate, yCoordinate, imageWidth, imageHeight);
          doc.setFont('bold');
          doc.setFontSize(18);
          doc.text('Agenda mensual', 90, 50);
          doc.setFont('normal');
      

          doc.setFontSize(12);
         // doc.text(`Dr: ${this.storage.getDataItem("nombre")} ${this.storage.getDataItem("apellido1")} ${this.storage.getDataItem("apellido2")}`, 20, 20);

          let yPosition = 60;
          let status="";
          this.datesR.forEach((date: any) => {
            const blockHeight = 28; // Ajusta la altura del bloque según tus necesidades

            // Dibujar el borde
            doc.rect(20, yPosition, 170, blockHeight); // 20: posición x, yPosition: posición y, 150: ancho del bloque, blockHeight: altura del bloque

            // Agregar el texto dentro del borde
            doc.text(`Fecha y hora: ${date.fecha}  ${this.formatHora(date.hora)}`, 25, yPosition + 5);
            doc.text(`Paciente: ${date.Nombre} `, 25, yPosition + 10);
            doc.text(`Celular: ${date.Celular}  `, 25, yPosition + 15);
            doc.text(`Tratamiento: ${date.tratamiento}  `, 25, yPosition + 20);
            if (date.confirmada === "Cumplida") {
              status = "Confirmada";
          }else{
            status = "No confirmada";
          }
      
          // Agregar el estado al texto
          doc.text(`Estado: ${status} `, 25, yPosition + 25);
            // Incrementar la posición vertical para el siguiente bloque de texto
            yPosition += blockHeight + 5; // Ajusta el espaciado según tus necesidades
      
          });

          // Guardar o mostrar el PDF (puedes personalizar esto según tus necesidades)
          doc.save('reporte.pdf');
        } else {
          console.error('Error:', response);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

}
