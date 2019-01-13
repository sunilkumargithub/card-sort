import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardLogicRoutingModule } from './card-logic-routing.module';
import { CardLogicService } from './card-logic.service';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';

import { PrimeModule } from '../../primengModule';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexModule } from '@angular/flex-layout';
import { PipeModule } from '../../core/pipe/pipe.module';
import { AngularFirestore } from '@angular/fire/firestore';


@NgModule({
  imports: [
    CommonModule,
    CardLogicRoutingModule,
    PrimeModule,
    ReactiveFormsModule,
    FormsModule,
    FlexModule,
    PipeModule
  ],
  declarations: [AddComponent, ListComponent, EditComponent],
  providers: [AngularFirestore, CardLogicService]
})
export class CardLogicModule { }
