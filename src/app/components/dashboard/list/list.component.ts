import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { DashboardService, CardItem } from '../dashboard.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProjectService } from '../../project/project.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PagerService } from '../../../services/pager/pager.service';
import { LoginService } from '../../../core/services';
import { UserService } from '../../user/user.service';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
companies = [];
fieldid;
  display: boolean;
   rows = [];
  // public rows: any[] = [];
  viewData: CardItem;
  displayUploadModal: boolean;
  projects: Array<object>;
  uploadCardForm: FormGroup;
  comingdataform:FormGroup;
  allItems: any[];
  pager: any = {};
  // isShowTable: any = false;
  fileReset: any;
  projectId: any = '';
  totalprice;

  constructor(
    private router: Router,
    private dashboardservice: DashboardService,
    private _messageService: MessageService,
    private spinner: NgxSpinnerService,
    private projectService: ProjectService,
    private _pagerService: PagerService,
    private _loginService: LoginService,
    private userservice: UserService,
  ) {
    this.display = false;
    this.displayUploadModal = false;
    this.viewData = {
      project: '',
      deck: '',
      title: '',
      points: '',
      card_image: '',
      insertedAt: new Date,
      isDeleted: false,
    };
    this.uploadCardForm = new FormGroup({
      card: new FormControl('', [Validators.required]),
      project: new FormControl('', [Validators.required]),
      company: new FormControl(''),

    });
    this.comingdataform = new FormGroup({
      // company: new FormControl('', [Validators.required]),
      // project: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.spinner.show();
    this.userservice.getAllCompanies().then(res => {
      this.companies = res;
      console.log('companies' , this.companies);
      this.spinner.hide();
    }).catch(err => {
      this.spinner.hide();
    });
    // this.spinner.show();
    // this.cardService.getAllProject().then(projects => {
    //   this._loginService.filterCompany(projects, 'data', 'company').then(filtered => {
    //     this.projects = filtered;
    //     this.spinner.hide();
    //   });
    // }).catch(err => {
    //   console.log(err);
    //   this.spinner.hide();
    // });
    // console.log('companies' , this.companies);
  }
  changeField(e) {
console.log('ewfn',e);
this.fieldid = e;
  }


  changeProject(value) {
    this.getData(1, value);
  }
  finddata() {
  this.dashboardservice.getfieldData(this.fieldid).then((res)=> {
console.log('resp' , res);
this.rows = res;
let sum = 0;
    for (let i = 0; i < res.length; i++) {
        sum+= res[i].data.price;
    }
this.totalprice = sum;
console.log('totalprice', this.totalprice);
  } , error => {
    console.log(error);
  });
  }


  getData(page: number, value?: string) {
    this.spinner.show();
    this.dashboardservice.getData(value).then(resp => {
      this.allItems = resp;
      // console.log(this.allItems);
      this.pager = this._pagerService.getPager(this.allItems.length, page);
      this.rows = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
      this.spinner.hide();
    }).catch(err => {
      console.log(err);
      this.spinner.hide();
    });
  }

  // openUploadDialog() {
  //   this.projectService.getData().then(result => {
  //     this.projects = [
  //       ...this.projects,
  //       ...result.map(i => ({
  //         label: i.data.title,
  //         value: i.id,
  //       }))
  //     ];
  //     this.displayUploadModal = true;
  //   }).catch(err => {
  //     this._messageService.add({ severity: 'error', summary: 'error', detail: err.message });
  //   });
  // }

  view(id, project) {
    this.dashboardservice.getById(id).then(resp => {
      this.viewData = resp.data;
      this.viewData['project'] = project;
      // this.viewData['deck'] = deck;
      this.display = true;
      // console.log(this.viewData);
    }).catch(() => {
      this._messageService.add({ severity: 'error', summary: 'error', detail: 'Oops! Something went wrong. Please try again' });
    });
  }

  goToEdit(id) {
    this.router.navigate(['app/card/edit/' + id]);
  }

  onConfirm(id) {
    this._messageService.clear('c');
    this.dashboardservice.delete(id).then(() => {
      this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Data deleted successfully' });
      this.getData(1);
    }).catch(() => {
      this._messageService.add({ severity: 'error', summary: 'error', detail: 'Oops! Something went wrong. Please try again' });
    });
  }

  onReject() { this._messageService.clear('c'); }

  delete(id) {
    this._messageService.add({
      key: 'c', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'Confirm to proceed',
      id: id
    });
  }

  convertFile(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      console.log(reader.result);
      this.dashboardservice.textToCsv(reader.result).then(resp => {
        this.uploadCardForm.patchValue({
          card: resp
        });
      });
    };
  }

  uplaodCard() {
    console.log(this.uploadCardForm.invalid, this.uploadCardForm.value);
    if (!this.uploadCardForm.invalid) {
      this.displayUploadModal = false;
    } else {
      console.log(this.uploadCardForm.value);
    }
  }

  getViewData(page: number) {
    this.spinner.show();
    this.dashboardservice.getData(this.projectId).then(res => {
      this.allItems = res;
      this.pager = this._pagerService.getPager(this.allItems.length, page);
      this.rows = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
      this.spinner.hide();
    }).catch(err => {
      this.spinner.hide();
    });
  }


  // showDialog() {
  //   this.display = true;
  // }

  // showConfirm() {
  //   this.messageService.add({ key: 'c', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'Confirm to proceed' });
  // }

  // onConfirm() {
  //   this.messageService.clear('c');
  //   console.log('confirm');
  // }

  // onReject() {
  //   this.messageService.clear('c');
  //   console.log('reject');
  // }

}

