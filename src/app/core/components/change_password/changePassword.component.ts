import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

import { APP_CONFIG } from '../../../app.config';
import { MessageService } from 'primeng/api';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoginService } from '../../services';


@Component({
  selector: 'app-change-password',
  templateUrl: './changePassword.component.html',
  styleUrls: ['./changePassword.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  changePassForm: FormGroup;
  code: string;

  constructor(
    @Inject(APP_CONFIG) private config: any,
    private router: Router,
    private _route: ActivatedRoute,
    private _messageService: MessageService,
    private _service: LoginService,
    public afAuth: AngularFireAuth,
    private spinner: NgxSpinnerService
  ) {
    this.changePassForm = new FormGroup({
      password: new FormControl('', [
        Validators.required, Validators.minLength(this.config.PASSWORD_MIN_LENGTH), Validators.maxLength(this.config.PASSWORD_MAX_LENGTH)
      ]),
    });
  }

  ngOnInit() {
    this.spinner.show();
    this._route.queryParams.subscribe((params) => {
      if (Object.keys(params).length) {
        this.afAuth.auth.checkActionCode(params['oobCode']).then(resp => {
          this.spinner.hide();
          this.code = params['oobCode'];
        }).catch(error => {
          this.spinner.hide();
          this._messageService.add({ severity: 'error', summary: 'Error', detail: error['message'] });
          this.router.navigate(['/login']);
        });
      }
    });
  }


  changePassFormSubmit() {
    this.spinner.show();
    if (!this.changePassForm.valid) {
      Object.keys(this.changePassForm.controls).forEach(key => {
        this.changePassForm.get(key).markAsTouched({ onlySelf: true });
      });
    } else {
      this._service.changePassword(this.code, this.changePassForm.value.password).then(respose => {
        this.spinner.hide();
        this._messageService.add({ severity: 'success', summary: 'Success', detail: respose['message'] });
        this.router.navigate(['/login']);
      }).catch(error => {
        this._messageService.add({ severity: 'error', summary: 'Error', detail: error['message'] });
      });
    }
  }


}
