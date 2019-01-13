import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardRoutingModule } from './card-routing.module';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { AddComponent } from './add/add.component';
import { PrimeModule } from '../../primengModule';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexModule } from '@angular/flex-layout';
import { PipeModule } from '../../core/pipe/pipe.module';
import { CardService } from './card.service';
import { AngularFirestore } from '@angular/fire/firestore';



@NgModule({
  imports: [
    CommonModule,
    CardRoutingModule,
    PrimeModule,
    ReactiveFormsModule,
    FormsModule,
    FlexModule,
    PipeModule
  ],
  declarations: [ListComponent, EditComponent, AddComponent],
  providers: [AngularFirestore, CardService]

})
export class CardModule { }
