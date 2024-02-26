import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { PageprincipalComponent } from "./pageprincipal/pageprincipal.component";
import { AuthGuard } from './auth-guard.service';

//doctor
import { EditProfileComponent } from "./profile/edit-profile/edit-profile.component"
import { UpdatepasswordComponent } from "./profile/updatepassword/updatepassword.component"
import { NewAppointmentComponent } from './doctor-schedule/new-appointment/new-appointment.component';
import { ScheduleViewComponent } from './doctor-schedule/schedule-view/schedule-view.component';
import { PatientslistComponent } from './patients/patientslist/patientslist.component';
import { ReviewsComponent } from './reviews/reviews/reviews.component';
import { DateSchedulerComponent } from './doctor-schedule/date-scheduler/date-scheduler.component';
import { ClinicalRecordsComponent } from './patients/clinical-records/clinical-records.component';
import { PatientDetailComponent } from './patients/patient-detail/patient-detail.component';
import { ServicePanelComponent } from './profile/service-panel/service-panel.component';

//patient
import { PatientpanelComponent } from './patient/patientpanel/patientpanel.component';
import { RegisterpatientComponent } from './patient/registerpatient/registerpatient.component';

import { SearchspecialistComponent } from './patient/searchspecialist/searchspecialist.component';
import { UpdatedataComponent } from './patient/perfilpatient/updatedata/updatedata.component';
import { UpdatepasswordpatientComponent } from './patient/perfilpatient/updatepasswordpatient/updatepasswordpatient.component';
import { FavoritesComponent } from './patient/favorites/favorites.component';
import { NewdatpatientComponent } from './patient/newdatpatient/newdatpatient.component';
import { HacercomentComponent } from './patient/hacercoment/hacercoment.component';
import {RespuestasComponent} from './patient/respuestas/respuestas.component';

const routes: Routes = [
  //{ path: "", component: AppComponent, pathMatch: "full" },
  { path: "", component: NewAppointmentComponent, pathMatch: "full" },
  { path: "login", component: LoginComponent, pathMatch: "full"},
  { path: "register", component: RegisterComponent, pathMatch: "full"},
  
  //doctor
  { path: "profile/editprofile", component: EditProfileComponent, pathMatch: "full", canActivate: [AuthGuard]},
  { path: "profile/updatepassword", component: UpdatepasswordComponent, pathMatch: "full" , canActivate: [AuthGuard]},
  { path: "schedule/newappointment", component: NewAppointmentComponent, pathMatch: "full"},
  { path: "schedule/scheduleview", component: ScheduleViewComponent, pathMatch: "full" , canActivate: [AuthGuard]},
  { path: "patients/patientslist", component: PatientslistComponent, pathMatch: "full" , canActivate: [AuthGuard]},
  { path: "reviews", component: ReviewsComponent, pathMatch: "full" , canActivate: [AuthGuard]},
  { path: "schedule/date-scheduler", component: DateSchedulerComponent, pathMatch: "full" , canActivate: [AuthGuard]},
  { path: "patients/patientdetail/clinical-records", component: ClinicalRecordsComponent, pathMatch: "full" , canActivate: [AuthGuard]},
  { path: "patients/patient-detail", component: PatientDetailComponent, pathMatch: "full" , canActivate: [AuthGuard]},
  { path: "profile/service-panel", component: ServicePanelComponent, pathMatch: "full" , canActivate: [AuthGuard]},


  //patient
  { path: "patient/patientpanel", component: PatientpanelComponent, pathMatch: "full" , canActivate: [AuthGuard]},
  { path: "registerpatient", component: RegisterpatientComponent, pathMatch: "full"},
  { path: "search", component: SearchspecialistComponent, pathMatch: "full" , canActivate: [AuthGuard]},
  { path: "perfilpatient/updatedata", component: UpdatedataComponent, pathMatch: "full" , canActivate: [AuthGuard]},
  { path: "perfilpatient/updatepasswordpatient", component: UpdatepasswordpatientComponent, pathMatch: "full" , canActivate: [AuthGuard]},
  { path: "favorites", component: FavoritesComponent, pathMatch: "full" , canActivate: [AuthGuard]},
  { path: "newdatepatient", component: NewdatpatientComponent, pathMatch: "full" , canActivate: [AuthGuard] },
  { path: "newcomment",component:HacercomentComponent,pathMatch: "full" },
  { path: "respuestas", component:RespuestasComponent,pathMatch: "full" }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
