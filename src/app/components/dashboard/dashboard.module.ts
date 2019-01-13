import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { AddComponent } from './add/add.component';
import { PrimeModule } from '../../primengModule';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexModule } from '@angular/flex-layout';
import { PipeModule } from '../../core/pipe/pipe.module';
// import { dashboardservice } from './dashboard.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { DashboardService } from './dashboard.service';



@NgModule({
  imports: [
    CommonModule,
    // CardRoutingModule,
    DashboardRoutingModule,
    PrimeModule,
    ReactiveFormsModule,
    FormsModule,
    FlexModule,
    PipeModule
  ],
  declarations: [ListComponent, EditComponent, AddComponent],
  providers: [AngularFirestore, DashboardService]

})
export class DashboardModule { }
