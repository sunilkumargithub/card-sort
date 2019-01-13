import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ClientService } from '../client.service';
// import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService, LoginService } from '../../../core/services';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  clientAddForm: FormGroup;
  formInvalid: boolean;
  categories: any = [];
  companies: any = [];
  dialog_display = false;
  userPassword = '';

  constructor(
    private router: Router,
    private clientService: ClientService,
    private spinner: NgxSpinnerService,
    private _messageService: MessageService,
    private _angular_authservice: AngularFireAuth,
    private authr: AuthService,
    private _loginService: LoginService,
  ) {
    this.formInvalid = true;
    this.clientAddForm = new FormGroup({
      company: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)]),
      lastName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      // address: new FormControl('', [ Validators.required ]),
    });
  }

  ngOnInit() {
    this.spinner.show();
    this.clientService.getAllCompanies().then(res => {
      this._loginService.filterCompany(res, 'id').then(filtered => {
        this.companies = filtered;
        this.spinner.hide();
      });
    }).catch(err => {
      this.spinner.hide();
    });
  }

  changeCompany(value) {
    this.spinner.show();
    this.clientService.getAllCategory(value).then(res => {
      this.categories = res;
      this.spinner.hide();
    }).catch(err => {
      this.spinner.hide();
    });
  }

  submit_popup() {
    if (this.userPassword !== '') {
      this.clientService.setSuperadminCredential(true);
    } else {
      this.clientService.setSuperadminCredential(false);
    }
  }

  cancel_popup() {
    this.clientService.setSuperadminCredential(false);
    this.dialog_display = false;
  }

  save(data) {
    if (!this.clientAddForm.valid) {
      Object.keys(this.clientAddForm.controls).forEach(key => {
        this.clientAddForm.get(key).markAsTouched({ onlySelf: true });
      });
    } else {

      this.dialog_display = true;
      this.clientService.getSuperadminCredential().subscribe(res => {
        if (res) {
          this.spinner.show();
          const credential = firebase.auth.EmailAuthProvider.credential(
            firebase.auth().currentUser.email, this.userPassword);

          this.authr.doRegister(data)
            .then(res => {
              this.formInvalid = false;
              this.clientService.save(data, res.user.uid).then(res => {
                this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Client added successfully' });

                this._angular_authservice.auth.signInWithCredential(credential).then(success => {
                  this.spinner.hide();
                  this.router.navigate(['app/client/list']);
                });
                
              }).catch(err => {
                this.spinner.hide();
                this._messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
              });
            }, err => {
              this.spinner.hide();
              this._messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
            });
        } else {
          this.dialog_display = res;
        }
      });
      // this.authr.doRegister(data)
      //   .then(res => {
      //     this.formInvalid = false;
      //     this.clientService.save(data, res.user.uid).then(res => {
      //       this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Client added successfully' });
      //       setTimeout(() => {
      //         this.router.navigate(['app/client/list']);
      //       }, 800);
      //     }).catch(err => {
      //       this.spinner.hide();
      //       this._messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
      //     });
      //   }, err => {
      //     console.log(err);
      //     this._messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
      //   });
    }
  }


}
