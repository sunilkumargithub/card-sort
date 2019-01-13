import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormControlName } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
// import { CardService, CardItem } from '../dashboard.service';
import { Upload } from '../../../services/upload';
import { LoginService } from '../../../core/services';
import { DashboardService } from '../dashboard.service';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  cardAddForm: FormGroup;
  formInvalid: boolean;
  projects: any;
  decks: any;


  constructor(
    private router: Router,
    private cardService: DashboardService,
    private spinner: NgxSpinnerService,
    private _messageService: MessageService,
    private _loginService: LoginService
  ) {
    this.formInvalid = true;
    this.cardAddForm = new FormGroup({
      card_image: new FormControl(''),
      project: new FormControl('', [Validators.required]),
      deck: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required]),
      points: new FormControl('', [Validators.required]),
      content: new FormControl('', [Validators.required]),
    });
  }


  ngOnInit() {
    this.spinner.show();
    this.cardService.getAllProject().then(res => {
      this._loginService.filterCompany(res, 'data', 'company').then(filtered => {
        this.projects = filtered;
        this.spinner.hide();
      });
    }).catch(err => {
      this.spinner.hide();
    });
  }

  changeProject(event) {
    const filtered_data = this.projects.filter(item => item.id === event.target.value);
    if(filtered_data.length > 0) {
      this.decks = filtered_data[0].data.decks;
    } else {
      this.decks = [];
      this.cardAddForm.patchValue({ deck: '' });
    }   
  }

  selectFile(event, type) {
    this.spinner.show();
    const file = event.target.files.item(0);
    if (file.type.match('image.*')) {
      const currentFile = new Upload(event.target.files[0]);
      this.cardService.pushFileToStorage(currentFile).then(response => {
        this.cardAddForm.patchValue({
          [type]: response['url']
        });
        this.spinner.hide();
      }).catch(error => {
        this.spinner.hide();
        console.log(error);
      });
    } else {
      this.cardAddForm.patchValue({
        card_image: ''
      });
      this.spinner.hide();
      this._messageService.add({ severity: 'error', summary: 'Error', detail: 'invalid format' });
    }
  }


  cardAddFormSubmit() {
    this.spinner.show();
    if (!this.cardAddForm.valid) {
      this.spinner.hide();
      Object.keys(this.cardAddForm.controls).forEach(key => {
        this.cardAddForm.get(key).markAsTouched({ onlySelf: true });
      });
    } else {
      this.formInvalid = false;
      this.cardService.save(this.cardAddForm.value).then(res => {
        this.spinner.hide();
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Card added successfuly.' });
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
