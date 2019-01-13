import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ProjectService } from '../project.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { PagerService } from '../../../services/pager/pager.service';
import { LoginService } from '../../../core/services';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  display: boolean;
  rows = [];
  testGroup = [];
  rowdata: any;
  allItems: any[];
  pager: any = {};

  constructor(private _service: ProjectService
    , private _messageService: MessageService
    , private _spinner: NgxSpinnerService
    , private _router: Router
    , private _pagerService: PagerService
    , private _loginService: LoginService) {
    this.display = false;
    this.getViewData(1);
  }

  ngOnInit() {
  }

  getViewData(page: number) {
    this._spinner.show();
    this._service.getData().then(res => {
      this._loginService.filterCompany(res, 'data', 'company').then(filtered => {
        // console.log(filtered);
        this.allItems = filtered;
        this.pager = this._pagerService.getPager(this.allItems.length, page);
        this.rows = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
        this._spinner.hide();
      });
    }).catch(err => {
      this._spinner.hide();
    });
  }

  showDialog(rowData: any) {
    this.rowdata = rowData;
    // console.log(this.rowdata);
    this.display = true;

  }

  showConfirm(rowData: any) {
    this.rowdata = rowData;
    this._messageService.add({ key: 'c', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'Confirm to proceed' });
  }

  onConfirm(data: any) {
    this._spinner.show();
    this._service.delete(data.id).then(res => {
      this.getViewData(1);
      this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Data deleted successfully!' });
    }).catch(err => {
      this._spinner.hide();
      this._messageService.add({ severity: 'error', summary: 'Error', detail: err['message'] });
    });
    this._messageService.clear('c');

  }

  onReject() {
    this._messageService.clear('c');
    console.log('reject');
  }


}
