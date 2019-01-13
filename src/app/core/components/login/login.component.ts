import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

import { APP_CONFIG } from '../../../app.config';
import { MessageService } from 'primeng/api';
import { LoginService } from '../../services/login/login.service';
import { StorageService } from '../../services';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  showSpinner: boolean;
  formInvalid: boolean;
  resetEmail: string;
  display1: boolean;
  private previousUrl: string = undefined;

  constructor(
    @Inject(APP_CONFIG) private config: any,
    private router: Router,
    private _messageService: MessageService,
    private _service: LoginService,
    private spinner: NgxSpinnerService,
    private storageService: StorageService,
    private _afs: AngularFirestore,
    private angularAuth: AngularFireAuth

  ) {
    this.formInvalid = true;
    this.showSpinner = false;
    this.display1 = false;

    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i)]),
      password: new FormControl('', [
        Validators.required, Validators.minLength(this.config.PASSWORD_MIN_LENGTH), Validators.maxLength(this.config.PASSWORD_MAX_LENGTH)
      ]),
    });
  }

  ngOnInit() {
    if (this._service.isLoggedin()) {
      // console.log(this._service.getPreviousUrl());
      this.router.navigateByUrl(this._service.getPreviousUrl());
    }
  }

  showDialog() {
    this.display1 = true;
  }

  login(value): void {
    this._service.login(value.email,
      value.password).then(
        data => {
          // console.log(data);
          this.angularAuth.auth.currentUser.getIdToken()
            .then(
              token => {
                sessionStorage.setItem('_token', token);
                if (token) {
                  if (data['Role'].indexOf('superadmin') > -1) {
                    this.router.navigateByUrl('/app/dashboard/list');
                  } else {
                    this.router.navigateByUrl('/app/dashboard/list');
                  }
                  this.spinner.hide();
                  // this._messageService.add({ severity: 'success', summary: 'Success', detail: 'You have successfully logged in' });
                }
              });
        },
        error => {
          console.log(error);
          this.spinner.hide();
          this._messageService.add({ severity: 'error', summary: 'Error', detail: error['message'] });
        });
  }



  loginFormSubmit() {
    this.spinner.show();
    if (!this.loginForm.valid) {
      this.spinner.hide();
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key).markAsTouched({ onlySelf: true });
      });
    } else {
      this.login(this.loginForm.value);

      this.formInvalid = false;
    }
  }

  forgetPass() {
    this.spinner.show();
    this._service.forgetPassword(this.resetEmail).then(res => {
      this.spinner.hide();
      this._messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
      this.display1 = false;
    }).catch(err => {
      this.spinner.hide();
      this._messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
    });
  }
}
