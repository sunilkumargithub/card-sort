import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { ListComponent } from './list/list.component';
import { PrimeModule } from '../../primengModule';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexModule } from '@angular/flex-layout';
import { PipeModule } from '../../core/pipe/pipe.module';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';



@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    PrimeModule,
    ReactiveFormsModule,
    FlexModule,
    FormsModule,
    PipeModule
  ],
  declarations: [ListComponent, AddComponent, EditComponent]
})
export class UserModule { }
