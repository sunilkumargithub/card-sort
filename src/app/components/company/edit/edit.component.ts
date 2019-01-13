import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormControlName } from '@angular/forms';
import { CompanyService } from '../company.service';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  companyEditForm: FormGroup;
  formInvalid: boolean;

  constructor(
    private companyService: CompanyService,
    private ac: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private _messageService: MessageService,
  ) {
    this.formInvalid = true;
    this.companyEditForm = new FormGroup({
      companyName: new FormControl('', [Validators.required, Validators.pattern(/^[^-\s][a-zA-Z0-9._\s-]+$/)]),
    });
  }

  ngOnInit() {
    this.ac.params.subscribe(params => {
      this.companyService.getById(params.id).then(resp => {
        this.companyEditForm.patchValue({
          id: params.id,
        });
        this.companyEditForm.patchValue(resp.data);
      }).catch(err => {
        console.log(err);
      });
    });
  }

  save(data) {
    this.spinner.show();
    if (!this.companyEditForm.valid) {
      Object.keys(this.companyEditForm.controls).forEach(key => {
        this.companyEditForm.get(key).markAsTouched({ onlySelf: true });
      });
    } else {
      this.formInvalid = false;
      this.ac.params.subscribe(params => {
        data['id'] = params.id;
      });
      this.companyService.save(data).then(res => {
        this.spinner.hide();
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Field updated successfully' });
        setTimeout(() => {
          this.router.navigate(['app/company/list']);
        }, 2000);
      }).catch(err => {
        this.spinner.hide();
        this._messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
      });
    }
  }

}
