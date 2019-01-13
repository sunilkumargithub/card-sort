import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { CategoryService } from '../category.service';
import { LoginService } from '../../../core/services';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  categoryAddForm: FormGroup;
  formInvalid: boolean;
  companies: any;


  constructor(
    private _router: Router,
    private categoryService: CategoryService,
    private _spinner: NgxSpinnerService,
    private _messageService: MessageService,
    private _loginService: LoginService,
  ) {
    this.formInvalid = true;
    this.categoryAddForm = new FormGroup({
      company: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required, Validators.pattern(/^[^-\s][a-zA-Z0-9_\s-]+$/)]),

    });
  }

  ngOnInit() {

    this.categoryService.getAllCompany().then(companies => {
      this._loginService.filterCompany(companies, 'id').then(filtered => {
        this.companies = filtered;
      });
    }).catch(error => {
      this._spinner.hide();
    });
  }

  categoryAddFormSubmit() {
    this._spinner.show();
    if (!this.categoryAddForm.valid) {
      this._spinner.hide();
      Object.keys(this.categoryAddForm.controls).forEach(key => {
        this.categoryAddForm.get(key).markAsTouched({ onlySelf: true });
      });
    } else {
      this.formInvalid = false;
      // console.log(this.categoryAddForm.value);
      this.categoryService.save(this.categoryAddForm.value).then(res => {
        this._spinner.hide();
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Month added successfuly.' });
        setTimeout(() => {
          this._router.navigate(['/app/category']);
        }, 2000);
      }).catch(error => {
        this._spinner.hide();
        this._messageService.add({ severity: 'error', summary: 'Error', detail: error['message'] });
      });
    }
  }

}
