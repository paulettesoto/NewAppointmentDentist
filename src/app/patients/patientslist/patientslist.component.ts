import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { storageService } from 'src/app/storage.service';
@Component({
  selector: 'app-patientslist',
  templateUrl: './patientslist.component.html',
  styleUrls: ['./patientslist.component.css']
})
export class PatientslistComponent implements OnInit {

  constructor(private http: HttpClient, private route:Router, private storage: storageService) { }
  patients: any[] = [];
  patients2: any[] = [];
  listaunida: any[] = [];
  page=1;
  pages=1;
  paged=4;
  toggleValue = false;
  ngOnInit(): void {
    this.toggleFuncion();
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
  clinicalrecords(patient:any){
    this.storage.setDataItem("idPaciente", patient.id);
    this.storage.setDataItem("NombrePaciente", patient.Nombre);
    this.storage.setDataItem("Apellido1Paciente", patient.PrimerApe);
    this.storage.setDataItem("Apellido2Paciente", patient.SegundoApe);    
    console.log(patient.edad);
    this.storage.setDataItem("fechaNac", patient.fechaNac);
    this.storage.setDataItem("celular", patient.celular);
    this.storage.setDataItem("edad", patient.edad);
    this.route.navigate(['/patients/patientdetail/clinical-records']);
  }
  toggleFuncion() {
    // Cambiar el valor del toggle
    this.toggleValue = !this.toggleValue;

    // Llamar a la función correspondiente
    if (this.toggleValue) {
      const url = 'https://doctorappbackend-wpqd.onrender.com/patientslist/listapacientes';

    const params = new HttpParams()
      .set('idDoctor', this.storage.getDataItem('user'));

    this.http.get(url, { params }).subscribe(
      (response: any) => {
        if (response && response.patients) {
          this.patients = response.patients;
          this.pages=Math.ceil(this.patients.length/this.paged);
          console.log(this.patients);
        } else {
          console.error('Error:', response);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
    } else {
      const url = 'https://doctorappbackend-wpqd.onrender.com/patientslist/listapacientescuenta';

    const params = new HttpParams()
      .set('idDoctor', this.storage.getDataItem('user'));

    this.http.get(url, { params }).subscribe(
      (response: any) => {
        if (response && response.patientsc) {
          this.patients = response.patientsc;
          this.pages=Math.ceil(this.patients.length/this.paged);
          console.log(this.patients);
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
  patientdetail(patient:any, edad:any) {
    // Limpiar localStorage
    this.storage.setDataItem("idPaciente", patient.id);
    this.storage.setDataItem("NombrePaciente", patient.Nombre);
    this.storage.setDataItem("Apellido1Paciente", patient.PrimerApe);
    this.storage.setDataItem("Apellido2Paciente", patient.SegundoApe);
    console.log(patient.edad);
    this.storage.setDataItem("fechaNac", patient.fechaNac);
    this.storage.setDataItem("celular", patient.celular);
    this.storage.setDataItem("edad", patient.edad);
    this.route.navigate(['/patients/patient-detail']);

  }
}
