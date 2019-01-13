import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ColorService } from '../color.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { PagerService } from '../../../services/pager/pager.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  display: boolean;
  rows = [];
  rowdata: any;
  allItems: any[];
  pager: any = {};
  viewData: any;

  constructor(private _service: ColorService
    , private _messageService: MessageService
    , private _spinner: NgxSpinnerService
    , private _router: Router
    , private _pagerService: PagerService) {
    this.display = false;
    this.viewData = {
      color: '',
      code: '',
      insertedAt: new Date,
      isDeleted: false,
    };
    this.getViewData(1);
  }

  ngOnInit() {
    this.display = false;
    this.getViewData(1);
  }

  getViewData(page: number) {
    this._spinner.show();
    this._service.getData().then(res => {
      this.allItems = res;
      this.pager = this._pagerService.getPager(this.allItems.length, page);
      this.rows = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
      this._spinner.hide();
    }).catch(err => {
      this._spinner.hide();
    });
  }

  view(id) {
    this._service.getById(id).then(resp => {
      this.viewData = resp.data;
      this.display = true;
    }).catch(() => {
      this._messageService.add({ severity: 'error', summary: 'error', detail: 'Oops! Something went wrong. Please try again' });
    });
  }

  goToEdit(id) {
    this._router.navigate(['app/color/edit/' + id]);
  }

  showDialog(rowData: any) {
    this.rowdata = rowData;
    this.display = true;
  }

  showConfirm(rowData: any) {
    this.rowdata = rowData;
    this._messageService.add({ key: 'c', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'Confirm to proceed' });
  }

  delete(id) {
    this._messageService.add({
      key: 'c', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'Confirm to proceed',
      id: id
    });
  }

  onConfirm(id: any) {
    this._spinner.show();
    this._service.delete(id).then(res => {
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
