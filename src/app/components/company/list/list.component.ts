import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService, CompanyItem } from '../company.service';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { PagerService } from '../../../services/pager/pager.service';
import { LoginService } from '../../../core/services';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  display: boolean;
  rows = [];
  viewData: CompanyItem;
  allItems: any[];
  pager: any = {};

  constructor(
    private router: Router,
    private companyService: CompanyService,
    private _messageService: MessageService,
    private spinner: NgxSpinnerService,
    private _pagerService: PagerService,
    private _loginService: LoginService,
  ) {
    this.display = false;
    this.viewData = {
      companyName: '',
      insertedAt: new Date,
      isDeleted: false,
    };
    this.getData(1);
  }

  ngOnInit() {
  }

  getData(page: number) {
    this.spinner.show();
    this.companyService.getData().then(resp => {
      this._loginService.filterCompany(resp, 'id').then(filtered => {
        this.allItems = filtered;
        this.pager = this._pagerService.getPager(this.allItems.length, page);
        this.rows = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
        this.spinner.hide();
      });
    }).catch(err => {
      console.log(err);
      this.spinner.hide();
    });
  }

  view(id) {
    this.companyService.getById(id).then(resp => {
      this.viewData = resp.data;
      this.display = true;
    }).catch(() => {
      this._messageService.add({ severity: 'error', summary: 'error', detail: 'Oops! Something went wrong. Please try again' });
    });
  }

  goToEdit(id) {
    this.router.navigate(['app/company/edit/' + id]);
  }

  onConfirm(id) {
    this._messageService.clear('c');
    this.companyService.delete(id).then(() => {
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

}
