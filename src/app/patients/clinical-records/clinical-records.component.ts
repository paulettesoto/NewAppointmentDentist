import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { storageService } from 'src/app/storage.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2'

import * as jsPDF from 'jspdf';

@Component({
  selector: 'app-clinical-records',
  templateUrl: './clinical-records.component.html',
  styleUrls: ['./clinical-records.component.css']
})
export class ClinicalRecordsComponent implements OnInit {
  clinicalRecordsAnswers:any[] = [];
  clinicalRecords: any[] = [];
  nombre:string;
  apellido1:string;
  apellido2:string;
  idPacient:string;
  edad:string;
  fechaNac:string;
  celular:string;
  page=1;
  pages=1;
  paged=14;
  respuestas: { idPregunta: number, respuesta: string }[] = [];
  flag:number;
  constructor(private http:HttpClient, private storage:storageService,private route:Router){
    this.idPacient=this.storage.getDataItem("idPaciente");
    this.nombre=this.storage.getDataItem("NombrePaciente");
    this.apellido1=this.storage.getDataItem("Apellido1Paciente");
    this.apellido2= this.storage.getDataItem("Apellido2Paciente");
    this.edad=this.storage.getDataItem("edad");
    console.log(this.edad);
    this.fechaNac=this.storage.getDataItem("fechaNac");
    this.celular=this.storage.getDataItem("celular");
    this.flag=0;
  }
 
  ngOnInit(): void {
    this.preguntas();
    this.answers()
    
  }
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
  preguntas() {

    const url = 'https://doctorappbackend-wpqd.onrender.com/clinicalRecords/clinicalRecords';

    const params = new HttpParams()
      .set('idDoctor', this.storage.getDataItem('user'));
      this.http.get(url, { params }).subscribe(
        (response: any) => {
          if (response && response.clinicalRecords) {
            this.clinicalRecords = response.clinicalRecords;
            this.pages=Math.ceil(this.clinicalRecords.length/this.paged);
            console.log(response.clinicalRecords);
          } else {
            console.error('Error:', response);
          }
        },
        (error) => {
          console.error('Error:', error);
        }
      );
  
  }
 enviarRespuestas() {
      this.clinicalRecords.forEach((record: any) => {
        if(record.respuesta){
          const url = `https://doctorappbackend-wpqd.onrender.com/clinicalRecords-answers/addAnswer?idQ=${record.id}&idDoctor=${this.storage.getDataItem('user')}&Ans=${record.respuesta}&idPaciente=${this.idPacient}&cuenta=${0}`;
          const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'accept': 'application/json'
       });
        // Realiza la solicitud POST
          this.http.post(url, {headers}).subscribe(
            (response: any) => {
              console.log(response);
              
          // Manejar la respuesta según tus necesidades
        },
        (error) => {
          console.error('Error en la solicitud POST:', error);
        }
      );
      }
  
    });
    Swal.fire({
      
      text: 'Respuestas enviadas',
      icon: 'success',
    
    })
    
  }

generatePDF() {
  const url = 'https://doctorappbackend-wpqd.onrender.com/clinicalRecords-answers/clinicalRecords-answers';

  const params = new HttpParams()
    .set('idDoctor', this.storage.getDataItem('user'))
    .set('idPaciente', this.idPacient)
    .set('cuenta', 0);

  this.http.get(url, { params }).subscribe(
    (response: any) => {
      if (response && response.clinicalRecordsAnswers) {
        this.clinicalRecordsAnswers = response.clinicalRecordsAnswers;
        console.log(response.clinicalRecordsAnswers);

        const doc = new jsPDF.jsPDF();
        const imagePath = '../../assets/logo-removebg.png';
        const xCoordinate = 80;
        const yCoordinate = 10;
        const imageWidth = 60;  // Ancho de la imagen en mm
        const imageHeight = 30;  // Alto de la imagen en mm
        doc.addImage(imagePath, 'PNG', xCoordinate, yCoordinate, imageWidth, imageHeight);
        // Agregar contenido al PDF
        doc.setFont('bold');
        doc.setFontSize(18);
        doc.text('Historial clínico', 90, 50);

        doc.setFontSize(12);
        const nombre= `${this.nombre} ${this.apellido1} ${this.apellido2}`;
        const nombre_pdf=`historial_${nombre}.pdf`;
        doc.text(`Nombre: ${nombre}`, 20, 60);
        doc.text(`Celular: ${this.celular}`, 120, 60);
        doc.text(`Edad: ${this.edad}`, 160, 60);

        let yPosition = 70;

        this.clinicalRecordsAnswers.forEach((recordA: any) => {
          doc.text(`${recordA.pregunta}`, 20, yPosition);
          yPosition += 5;
          doc.text(`${recordA.respuesta}`, 20, yPosition);
          yPosition += 10; // Ajusta el espaciado según tus necesidades
        });

        // Guardar o mostrar el PDF (puedes personalizar esto según tus necesidades)
        doc.save(nombre_pdf);
      } else {
        console.error('Error:', response);
      }
    },
    (error) => {
      console.error('Error:', error);
    }
  );
}

answers() {
  const url = 'https://doctorappbackend-wpqd.onrender.com/clinicalRecords-answers/clinicalRecords-answers';

  const params = new HttpParams()
    .set('idDoctor', this.storage.getDataItem('user'))
    .set('idPaciente', this.idPacient)
    .set('cuenta', 0);
  

  this.http.get(url, { params }).subscribe(
    (response: any) => {
      console.log(url,params);
      console.log(response);
      if (response && response.clinicalRecordsAnswers) {

        this.clinicalRecordsAnswers = response.clinicalRecordsAnswers;
        this.pages=Math.ceil(this.clinicalRecordsAnswers.length/this.paged);
        console.log(response.clinicalRecordsAnswers);
        this.flag=2;
        
      } else {
        
      console.log(this.flag);
        console.error('Error:', response);
      }
    },
    (error) => {
      
      console.error('Error:', error);
    }
  );
}

 
}
