import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ColorRoutingModule } from './color-routing.module';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { ColorService } from './color.service';

import { PrimeModule } from '../../primengModule';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexModule } from '@angular/flex-layout';
import { PipeModule } from '../../core/pipe/pipe.module';
import { AngularFirestore } from '@angular/fire/firestore';


@NgModule({
  imports: [
    CommonModule,
    ColorRoutingModule,
    PrimeModule,
    ReactiveFormsModule,
    FormsModule,
    FlexModule,
    PipeModule
  ],
  declarations: [AddComponent, EditComponent, ListComponent],
  providers: [AngularFirestore, ColorService]
})
export class ColorModule { }
