import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from './client.service';
import { ClientRoutingModule } from './client-routing.module';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { PrimeModule } from '../../primengModule';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexModule } from '@angular/flex-layout';
import { PipeModule } from '../../core/pipe/pipe.module';
import { AngularFirestore } from '@angular/fire/firestore';

@NgModule({
  imports: [
    CommonModule,
    ClientRoutingModule,
    PrimeModule,
    ReactiveFormsModule,
    FormsModule,
    FlexModule,
    PipeModule
  ],
  declarations: [ListComponent, AddComponent, EditComponent],
  providers: [AngularFirestore, ClientService]
})
export class ClientModule { }
