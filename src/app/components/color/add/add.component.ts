import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
import { ColorService } from '../color.service';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  colorAddForm: FormGroup;
  formInvalid: boolean;
  constructor(private _service: ColorService
    , private _messageService: MessageService
    , private _spinner: NgxSpinnerService
    , private _router: Router
    , private _fb: FormBuilder) {
    this.formInvalid = true;
    this.colorAddForm = this._fb.group({
      color: new FormControl('', [Validators.required]),
      code: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
  }

  colorAddFormSubmit() {
    this._spinner.show();
    if (!this.colorAddForm.valid) {
      this._spinner.hide();
      Object.keys(this.colorAddForm.controls).forEach(key => {
        this.colorAddForm.get(key).markAsTouched({ onlySelf: true });
      });
    } else {
      this.formInvalid = false;
      console.log(this.colorAddForm.value);
      this._service.save(this.colorAddForm.value).then(res => {
        this._spinner.hide();
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'New Color added successfuly.' });
        setTimeout(() => {
          this._router.navigate(['/app/color']);
        }, 2000);
      }).catch(error => {
        this._spinner.hide();
        this._messageService.add({ severity: 'error', summary: 'Error', detail: error['message'] });
      });
    }
  }

}
