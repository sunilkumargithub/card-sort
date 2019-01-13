import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormControlName } from '@angular/forms';
import { CategoryService } from '../category.service';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../../core/services';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  categoryEditForm: FormGroup;
  formInvalid: boolean;
  companies: any;


  constructor(
    private categoryService: CategoryService,
    private ac: ActivatedRoute,
    private _router: Router,
    private _spinner: NgxSpinnerService,
    private _messageService: MessageService,
    private _loginService: LoginService,
  ) {
    this.formInvalid = true;
    this.categoryEditForm = new FormGroup({
      company: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required, Validators.pattern(/^[^-\s][a-zA-Z0-9_\s-]+$/)]),
    });
  }

  ngOnInit() {
    this.ac.params.subscribe(params => {
      this.categoryService.getById(params.id).then(resp => {
        this.categoryEditForm.patchValue({
          id: params.id,
        });
        this.categoryEditForm.patchValue(resp.data);
      }).catch(err => {
        console.log(err);
      });
    });
    this.categoryService.getAllCompany().then(companies => {
      this._loginService.filterCompany(companies, 'id').then(filtered => {
        this.companies = filtered;
      });
    }).catch(error => {
      this._spinner.hide();
    });
  }

  categoryEditFormSubmit() {
    this._spinner.show();
    if (!this.categoryEditForm.valid) {
      this._spinner.hide();
      Object.keys(this.categoryEditForm.controls).forEach(key => {
        this.categoryEditForm.get(key).markAsTouched({ onlySelf: true });
      });
    } else {
      this.formInvalid = false;
      // console.log(this.categoryAddForm.value);
      this.categoryService.save(this.categoryEditForm.value).then(res => {
        this._spinner.hide();
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Brand added successfuly.' });
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
