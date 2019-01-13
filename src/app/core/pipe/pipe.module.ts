import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchFilterPipe } from './filter.pipe';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SearchFilterPipe],
  exports: [SearchFilterPipe]
})
export class PipeModule { }
