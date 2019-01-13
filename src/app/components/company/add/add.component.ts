import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { CompanyService } from '../company.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  companyAddForm: FormGroup;
  formInvalid: boolean;

  constructor(
    private router: Router,
    private companyService: CompanyService,
    private spinner: NgxSpinnerService,
    private _messageService: MessageService,
  ) {
    this.formInvalid = true;
    this.companyAddForm = new FormGroup({
      companyName: new FormControl('', [Validators.required, Validators.pattern(/^[^-\s][a-zA-Z0-9._\s-]+$/)]),
    });
   }

  ngOnInit() {
  }

  save(data) {
    this.spinner.show();
    if (!this.companyAddForm.valid) {
      Object.keys(this.companyAddForm.controls).forEach(key => {
        this.companyAddForm.get(key).markAsTouched({ onlySelf: true });
      });
    } else {
      this.formInvalid = false;
      this.companyService.save(data).then(res => {
        this.spinner.hide();
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Field added successfully' });
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
