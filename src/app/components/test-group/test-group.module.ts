import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestGroupRoutingModule } from './test-group-routing.module';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { PrimeModule } from '../../primengModule';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexModule } from '@angular/flex-layout';
import { PipeModule } from '../../core/pipe/pipe.module';
import { TestGroupService } from './test-group.service';


@NgModule({
  imports: [
    CommonModule,
    TestGroupRoutingModule,
    PrimeModule,
    ReactiveFormsModule,
    FormsModule,
    FlexModule,
    PipeModule,
  ],
  declarations: [ListComponent, AddComponent, EditComponent],
  providers: [TestGroupService]
})
export class TestGroupModule { }
