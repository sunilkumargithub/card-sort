import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HeaderComponent } from './layouts/header/header.component';
import { APP_CONFIG } from './app.config';

describe('AppComponent', () => {
  let userService: Title;
  // tslint:disable-next-line:prefer-const
  let component: DashboardComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        HeaderComponent,
      ],
      imports: [
        MaterialModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: Title, useClass: Title },
        { provide: APP_CONFIG, useValue: {} },
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'angular-structure'`, async(() => {
    userService = TestBed.get(Title);
    expect(userService.getTitle()).toEqual('angular-structure');
  }));

});
