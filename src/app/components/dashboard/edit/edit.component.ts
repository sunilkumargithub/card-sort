import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// import { dashboardservice } from '../dashboard.service';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { Upload } from '../../../services/upload';
import { LoginService } from '../../../core/services';
import { DashboardService } from '../dashboard.service';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  cardEditForm: FormGroup;
  formInvalid: boolean;
  projects: any;
  editedID: any;
  decks: any;
  // deckID: any;

  constructor(
    private cardService: DashboardService,
    private acroute: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private _messageService: MessageService,
    private _loginService: LoginService
  ) {
    this.formInvalid = true;
    this.cardEditForm = new FormGroup({
      card_image: new FormControl(''),
      project: new FormControl('', [Validators.required]),
      deck: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required]),
      points: new FormControl('', [Validators.required]),
      content: new FormControl('', [Validators.required]),
    });
  }


  selectFile(event, type) {
    this.spinner.show();
    const file = event.target.files.item(0);
    if (file.type.match('image.*')) {
      const currentFile = new Upload(event.target.files[0]);
      //  console.log(currentFile);
      this.cardService.pushFileToStorage(currentFile).then(response => {
        this.cardEditForm.patchValue({
          [type]: response['url']
        });
        this.spinner.hide();
      }).catch(error => {
        console.log(error);
      });
    } else {
      this.cardEditForm.patchValue({
        card_image: ''
      });
      this.spinner.hide();
      this._messageService.add({ severity: 'error', summary: 'Error', detail: 'invalid format' });
    }
  }

  changeProject(value) {
    const filtered_data = this.projects.filter(item => item.id === value);
    if (filtered_data.length > 0) {
      this.decks = filtered_data[0].data.decks;
    } else {
      this.decks = [];
      this.cardEditForm.patchValue({ deck: '' });
    }
  }


  ngOnInit() {
    this.spinner.show();
    this.cardService.getAllProject().then(res => {
      this._loginService.filterCompany(res, 'data', 'company').then(filtered => {
        this.projects = filtered;
        this.acroute.params.subscribe(params => {
          this.editedID = params['id'];
          this.cardService.getById(this.editedID).then(response => {
            this.changeProject(response.data.project);
            this.cardEditForm.patchValue(response.data);
            this.spinner.hide();
          }).catch(error => {
          });
        });
      });
    }).catch(err => {
      this.spinner.hide();
    });
  }

  cardEditFormSubmit() {
    this.spinner.show();
    if (!this.cardEditForm.valid) {
      this.spinner.hide();
      Object.keys(this.cardEditForm.controls).forEach(key => {
        this.cardEditForm.get(key).markAsTouched({ onlySelf: true });
      });
    } else {
      this.formInvalid = false;
      this.cardEditForm.value['id'] = this.editedID;
      this.cardService.save(this.cardEditForm.value).then(res => {
        this.spinner.hide();
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Card updated successfuly.' });
        setTimeout(() => {
          this.router.navigate(['/app/card/list']);
        }, 2000);
      }).catch(error => {
        this.spinner.hide();
        this._messageService.add({ severity: 'error', summary: 'Error', detail: error['message'] });
      });
    }
  }

}
