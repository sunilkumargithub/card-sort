import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PrimeModule } from '../primengModule';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  HeaderComponent
  , SidebarComponent
  , FooterComponent
  , LoginComponent
  , MainComponent
  , ChangePasswordComponent
} from './components';
import { DrawerService, StorageService, AuthService, LoginService } from './services';

const components = [
  HeaderComponent,
  SidebarComponent,
  FooterComponent,
  LoginComponent,
  MainComponent,
  ChangePasswordComponent
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    PrimeModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [...components],
  exports: [...components],
  providers: [
    DrawerService,
    StorageService,
    LoginService,
    AuthService
  ]
})
export class CoreModule { }
