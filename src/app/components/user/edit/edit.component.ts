import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormControlName } from '@angular/forms';
// import { ClientService } from '../client.service';

import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from '../user.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  userEditForm: FormGroup;
  formInvalid: boolean;
  categories: any = [];
  companies: any = [];
  extra:any;

  constructor(
    private userService: UserService,
    private ac: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private _messageService: MessageService,
  ) {
    this.formInvalid = true;
    this.userEditForm = new FormGroup({
      company: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)]),
      lastName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z-]*$/)]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i)]),
     // password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      // address: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.spinner.show();
    this.ac.params.subscribe(params => {

      this.userService.getAllCompanies().then(res => {
        this.companies = res;
        this.userService.getById(params.id).then(resp => {
          this.changeCompany(resp.data.company);
          this.userEditForm.patchValue({
            id: params.id,
          });
          this.userEditForm.patchValue(resp.data);
        }).catch(err => {
          console.log(err);
        });
      }).catch(err => {
        this.spinner.hide();
      });
    });
  }

  changeCompany(value) {
    this.spinner.show();
    this.userService.getAllCategory(value).then(res => {
      this.categories = res;
      this.spinner.hide();
    }).catch(err => {
      this.spinner.hide();
    });
  }

  save(data) {
    this.spinner.show();
    if (!this.userEditForm.valid) {
      Object.keys(this.userEditForm.controls).forEach(key => {
        this.userEditForm.get(key).markAsTouched({ onlySelf: true });
      });
    } else {
      this.formInvalid = false;
      this.ac.params.subscribe(params => {
        data['id'] = params.id;
      });
      this.userService.save(data, this.extra).then(res => {
        this.spinner.hide();
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'User updated successfully' });
        setTimeout(() => {
          this.router.navigate(['app/user/list']);
        }, 800);
      }).catch(err => {
        this.spinner.hide();
        this._messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
      });
    }
  }

}

// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-edit',
//   templateUrl: './edit.component.html',
//   styleUrls: ['./edit.component.scss']
// })
// export class EditComponent implements OnInit {

//   constructor() { }

//   ngOnInit() {
//   }

// }
