import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectRoutingModule } from './project-routing.module';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { PrimeModule } from '../../primengModule';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexModule } from '@angular/flex-layout';
import { PipeModule } from '../../core/pipe/pipe.module';
import { ProjectService } from './project.service';

@NgModule({
  imports: [
    CommonModule,
    ProjectRoutingModule,
    PrimeModule,
    ReactiveFormsModule,
    FormsModule,
    FlexModule,
    PipeModule
  ],
  declarations: [AddComponent, EditComponent, ListComponent],
  providers: [ProjectService]
})
export class ProjectModule { }
