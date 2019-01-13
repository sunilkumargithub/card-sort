import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user/user.component';
import { ClientComponent } from './client/client.component';
import { ProjectComponent } from './project/project.component';
import { CardComponent } from './card/card.component';
import { TestGroupComponent } from './test-group/test-group.component';
import { ResultsComponent } from './results/results.component';
import { DeckComponent } from './deck/deck.component';
import { CardLogicComponent } from './card-logic/card-logic.component';
import { ColorComponent } from './color/color.component';
import { AuthService } from '../core/services';
import { CompanyComponent } from './company/company.component';
import { CategoryComponent } from './category/category.component';
import { DashboardComponent } from './dashboard/dashboard.component';






const routes: Routes = [
  {
    path: '',
    redirectTo: 'user'
  },
  {
    path: 'user',
    loadChildren: './user/user.module#UserModule',
    component: UserComponent,
    canLoad: [AuthService]
  },
  {
    path: 'company',
    loadChildren: './company/company.module#CompanyModule',
    component: CompanyComponent,
    canLoad: [AuthService]
  },
  {
    path: 'dashboard',
    loadChildren: './dashboard/dashboard.module#DashboardModule',
    component: DashboardComponent,
    canLoad: [AuthService]
  },
  {
    path: 'category',
    loadChildren: './category/category.module#CategoryModule',
    component: CategoryComponent,
    canLoad: [AuthService]
  },
  {
    path: 'client',
    loadChildren: './client/client.module#ClientModule',
    component: ClientComponent,
    canLoad: [AuthService]
  },
  {
    path: 'project',
    loadChildren: './project/project.module#ProjectModule',
    component: ProjectComponent,
    canLoad: [AuthService]
  },
  {
    path: 'card',
    loadChildren: './card/card.module#CardModule',
    component: CardComponent,
    canLoad: [AuthService]
  },
  {
    path: 'test-group',
    loadChildren: './test-group/test-group.module#TestGroupModule',
    component: TestGroupComponent,
    canLoad: [AuthService]
  },
  {
    path: 'deck',
    loadChildren: './deck/deck.module#DeckModule',
    component: DeckComponent,
    canLoad: [AuthService]
  },
  {
    path: 'result',
    loadChildren: './results/results.module#ResultsModule',
    component: ResultsComponent,
    canLoad: [AuthService]
  },
  {
    path: 'card_logic',
    loadChildren: './card-logic/card-logic.module#CardLogicModule',
    component: CardLogicComponent,
    canLoad: [AuthService]
  },
  {
    path: 'color',
    loadChildren: './color/color.module#ColorModule',
    component: ColorComponent,
    canLoad: [AuthService]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentsRoutingModule { }
