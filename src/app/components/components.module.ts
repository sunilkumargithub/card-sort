import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ComponentsRoutingModule } from './components-routing.module';
import { CoreModule } from '../core/core.module';
import { PrimeModule } from '../primengModule';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UserComponent } from './user/user.component';
import { ClientComponent } from './client/client.component';
import { CompanyComponent } from './company/company.component';
import { ProjectComponent } from './project/project.component';
import { CardComponent } from './card/card.component';
import { TestGroupComponent } from './test-group/test-group.component';
import { ResultsComponent } from './results/results.component';
import { DeckComponent } from './deck/deck.component';
import { CardLogicComponent } from './card-logic/card-logic.component';
import { CategoryComponent } from './category/category.component';
import { ColorComponent } from './color/color.component';
import { DashboardComponent } from './dashboard/dashboard.component';



@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ComponentsRoutingModule,
    PrimeModule,
    CoreModule,
    FlexLayoutModule,
    FormsModule,
  ],
  declarations: [
    UserComponent,
    ClientComponent,
    CompanyComponent,
    ProjectComponent,
    CardComponent,
    TestGroupComponent,
    ResultsComponent,
    DeckComponent,
    CardLogicComponent,
    CategoryComponent,
    ColorComponent,
    DashboardComponent
  ],
  providers: [],
})
export class ComponentsModule { }
