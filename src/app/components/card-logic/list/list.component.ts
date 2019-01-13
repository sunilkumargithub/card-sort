import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { CardLogicService, CardLogicItem } from '../card-logic.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { PagerService } from '../../../services/pager/pager.service';
import { LoginService } from '../../../core/services';
import { ProjectService } from '../../project/project.service';



@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  // rows = [];
  public rows: any[] = [];
  allItems: any[];
  pager: any = {};
  viewData: CardLogicItem;
  projects: Array<object>;
  projectId: any = '';



  constructor(
    private router: Router,
    private _service: CardLogicService,
    private _messageService: MessageService,
    private spinner: NgxSpinnerService,
    private _pagerService: PagerService,
    private _loginService: LoginService,
    private projectService: ProjectService,

  ) {
    this.viewData = {
      project: '',
      condition: '',
      deck: '',
      from_deck: '',
      from_card: '',
      to_deck: '',
      to_card: '',
      insertedAt: new Date,
      isDeleted: false,
    };
  }

  ngOnInit() {
    this.spinner.show();
    this._service.getAllProject().then(projects => {
      this._loginService.filterCompany(projects, 'data', 'company').then(filtered => {
        this.projects = filtered;
        this.spinner.hide();
      });
    }).catch(err => {
      console.log(err);
      this.spinner.hide();
    });

    // this.getData(1);
  }

  changeProject(value) {
    this.getData(1, value);
  }

  getData(page: number, value?: string) {
    this.spinner.show();
    this._service.getData(value).then(resp => {
      this.allItems = resp;
      // console.log(resp);
      setTimeout(() => {
        this._loginService.filterCompany(resp, 'project', 'company').then(filtered => {
          this.allItems = filtered;
          this.pager = this._pagerService.getPager(this.allItems.length, page);
          this.rows = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
          this.spinner.hide();
        });
      }, 2000);
    }).catch(err => {
      console.log(err);
      this.spinner.hide();
    });
  }

  onConfirm(id) {
    this._messageService.clear('c');
    this._service.delete(id).then(() => {
      this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Data deleted successfully' });
      this.getData(1);
    }).catch(() => {
      this._messageService.add({ severity: 'error', summary: 'error', detail: 'Oops! Something went wrong. Please try again' });
    });
  }

  getViewData(page: number) {
    this.spinner.show();
    this._service.getData(this.projectId).then(res => {
      this.allItems = res;
      this.pager = this._pagerService.getPager(this.allItems.length, page);
      this.rows = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
      this.spinner.hide();
    }).catch(err => {
      this.spinner.hide();
    });
  }


  onReject() {
    this._messageService.clear('c');
  }

  delete(id) {
    this._messageService.add({
      key: 'c', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'Confirm to proceed',
      id: id
    });
  }

}
