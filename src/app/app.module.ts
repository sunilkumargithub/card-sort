import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { APP_CONFIG, AppConfig } from './app.config';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ServiceModule, MessageService } from './services';
import { CoreModule } from './core/core.module';
import { PrimeModule } from './primengModule';
import { SharedModule } from './shared';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { AgmCoreModule } from '@agm/core';




@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    PrimeModule,
    AppRoutingModule,
    ServiceModule,
    CoreModule,
    SharedModule,
    FlexLayoutModule,
    NgxSpinnerModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDdXya7Hv9qr7CqIueDnatUYOdSj8COLxg',
      libraries: ['places']
    }),
  ],
  providers: [
    MessageService,
    Title,
    { provide: APP_CONFIG, useValue: AppConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
