import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultsRoutingModule } from './results-routing.module';
import { ListComponent } from './list/list.component';
import { PrimeModule } from '../../primengModule';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexModule } from '@angular/flex-layout';
import { PipeModule } from '../../core/pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    ResultsRoutingModule,
    PrimeModule,
    ReactiveFormsModule,
    FlexModule,
    FormsModule,
    PipeModule
  ],
  declarations: [ListComponent]
})
export class ResultsModule { }
