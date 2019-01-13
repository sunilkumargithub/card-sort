import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeckRoutingModule } from './deck-routing.module';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { PrimeModule } from '../../primengModule';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexModule } from '@angular/flex-layout';
import { PipeModule } from '../../core/pipe/pipe.module';
import { DeckService } from './deck.service';
import { AngularFirestore } from '@angular/fire/firestore';



@NgModule({
  imports: [
    CommonModule,
    DeckRoutingModule,
    PrimeModule,
    ReactiveFormsModule,
    FlexModule,
    FormsModule,
    PipeModule
  ],
  declarations: [ListComponent, EditComponent],
  providers: [AngularFirestore, DeckService]
})
export class DeckModule { }
