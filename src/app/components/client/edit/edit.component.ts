import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormControlName } from '@angular/forms';
import { ClientService } from '../client.service';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../../core/services';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  clientEditForm: FormGroup;
  formInvalid: boolean;
  categories: any = [];
  companies: any = [];
  extra: any;

  constructor(
    private clientService: ClientService,
    private ac: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private _messageService: MessageService,
    private _loginService: LoginService,
  ) {
    this.formInvalid = true;
    this.clientEditForm = new FormGroup({
      company: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)]),
      lastName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]*$/)]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/i)]),
      // password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      // address: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.spinner.show();
    this.ac.params.subscribe(params => {

      this.clientService.getAllCompanies().then(res => {
        this._loginService.filterCompany(res, 'id').then(filtered => {
          this.companies = filtered;
          this.clientService.getById(params.id).then(resp => {
            this.changeCompany(resp.data.company);
            this.clientEditForm.patchValue({
              id: params.id,
            });
            this.clientEditForm.patchValue(resp.data);
          }).catch(err => {
            console.log(err);
          });
        });
      }).catch(err => {
        this.spinner.hide();
      });
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

  save(data) {
    this.spinner.show();
    if (!this.clientEditForm.valid) {
      Object.keys(this.clientEditForm.controls).forEach(key => {
        this.clientEditForm.get(key).markAsTouched({ onlySelf: true });
      });
    } else {
      this.formInvalid = false;
      this.ac.params.subscribe(params => {
        data['id'] = params.id;
      });
      this.clientService.save(data, this.extra).then(res => {
        this.spinner.hide();
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Client updated successfully' });
        setTimeout(() => {
          this.router.navigate(['app/client/list']);
        }, 2000);
      }).catch(err => {
        this.spinner.hide();
        this._messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
      });
    }
  }

}
