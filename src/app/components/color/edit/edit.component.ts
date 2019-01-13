import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
import { ColorService } from '../color.service';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  colorEditForm: FormGroup;
  formInvalid: boolean;
  editedID: any;

  constructor(private _service: ColorService
    , private _messageService: MessageService
    , private _spinner: NgxSpinnerService
    , private _router: Router
    , private route: ActivatedRoute
    , private _fb: FormBuilder) {
    this.formInvalid = true;
    this.colorEditForm = this._fb.group({
      color: new FormControl('', [Validators.required]),
      code: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    this._spinner.show();
    this.route.params.subscribe(params => {
      this.editedID = params['id'];
      this._service.getById(this.editedID).then(response => {
        this.colorEditForm.patchValue(response.data);
        this._spinner.hide();
      }).catch(error => {
        this._spinner.hide();
      });
    });
  }

  colorEditFormSubmit() {
    this._spinner.show();
    if (!this.colorEditForm.valid) {
      this._spinner.hide();
      Object.keys(this.colorEditForm.controls).forEach(key => {
        this.colorEditForm.get(key).markAsTouched({ onlySelf: true });
      });
    } else {
      this.formInvalid = false;
      this.colorEditForm.value['id'] = this.editedID;
      this._service.save(this.colorEditForm.value).then(res => {
        this._spinner.hide();
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Color updated successfuly.' });
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
