// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReactiveFormsModule } from '@angular/forms';

// // import { MaterialModule } from '../../material.module';
// import { LoginComponent } from './login.component';
// // import { APP_CONFIG } from '../../app.config';
// import { RouterModule, Router } from '@angular/router';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// class MockRouter {
//   navigate = jasmine.createSpy('navigate');
// }

// describe('LoginComponent', () => {
//   let component: LoginComponent;
//   let fixture: ComponentFixture<LoginComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [LoginComponent],
//       imports: [
//         RouterModule,
//         BrowserAnimationsModule,
//         ReactiveFormsModule,
//         MaterialModule,
//       ],
//       providers: [
//         { provide: APP_CONFIG, useValue: {} },
//         { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } },
//       ]
//     })
//       .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(LoginComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create login component', () => {
//     expect(component).toBeTruthy();
//   });
// });
