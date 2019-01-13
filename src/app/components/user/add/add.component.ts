import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
// import { ClientService } from '../client.service';
// import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../../../core/services';
import { UserService } from '../user.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  userAddForm: FormGroup;
  formInvalid: boolean;
  categories: any = [];
  companies: any = [];
  dialog_display = false;
  userPassword = '';

  constructor(
    private router: Router,
    // private clientService: ClientService,
    private spinner: NgxSpinnerService,
    private _messageService: MessageService,
    private _angular_authservice: AngularFireAuth,
    private authr: AuthService,
    private userService: UserService,
  ) {
    this.formInvalid = true;
    this.userAddForm = new FormGroup({
      company: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      productName: new FormControl('', [Validators.required]),
      Description: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      // password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      // address: new FormControl('', [ Validators.required ]),
    });
  }

  ngOnInit() {
    this.spinner.show();
    this.userService.getAllCompanies().then(res => {
      this.companies = res;
      console.log('companies' , this.companies);
      this.spinner.hide();
    }).catch(err => {
      this.spinner.hide();
    });
  }

  changeCompany(value) {
    this.spinner.show();
    this.userService.getAllCategory(value).then(res => {
      this.categories = res;
      console.log('categories' , this.categories);

      this.spinner.hide();
    }).catch(err => {
      this.spinner.hide();
    });
  }

  // submit_popup() {
  //   if (this.userPassword !== '') {
  //     this.userService.setSuperadminCredential(true);
  //   } else {
  //     this.userService.setSuperadminCredential(false);
  //   }
  // }

  // cancel_popup() {
  //   this.userService.setSuperadminCredential(false);
  //   this.dialog_display = false;
  // }


  save(data) {
    if (!this.userAddForm.valid) {
      Object.keys(this.userAddForm.controls).forEach(key => {
        this.userAddForm.get(key).markAsTouched({ onlySelf: true });
      });
    } else {
      this.userService.savefielddata(data).then(res => {
      if(res) {
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'data added successfully' });

        setTimeout(() => {
          this.router.navigate(['/app/user/list']);
        }, 2000);
      }
                }).catch(err => {
                  this.spinner.hide();
                  this._messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
                });

    }
  }


}

