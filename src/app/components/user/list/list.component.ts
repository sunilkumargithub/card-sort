import { Component, OnInit } from '@angular/core';
import { PagerService } from '../../../services/pager/pager.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import * as firebase from 'firebase/app';
import { UserService , UserItem } from '../user.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  display: boolean;
  allItems: any[];
  rows: any[];
  rowdata: any;
  pager: any = {};
  viewData: UserItem;
  constructor(private _pagerService: PagerService,
    private router: Router,
    private userService: UserService,
    private _messageService: MessageService,
    private spinner: NgxSpinnerService,
  ) {
    this.display = false;
    this.viewData = {
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      password: '',
      insertedAt: new Date,
      isDeleted: false,
    };
    this.getData(1);
    // this.rows = [
    //   { name: 'Dummy User', email: 'dummy.user@mail.com' },
    //   { name: 'Test User', email: 'test.user@mail.com' },
    // ];
  }

  ngOnInit() {
  }
  getData(page: number) {
    this.spinner.show();
    this.userService.getData().then(resp => {
      console.log('get response ' , resp);
      this.allItems = resp;
      this.pager = this._pagerService.getPager(this.allItems.length, page);
      this.rows = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
      this.spinner.hide();
    }).catch(err => {
      console.log(err);
      this.spinner.hide();
    });
  }

  view(id) {
    this.userService.getById(id).then(resp => {
      this.viewData = resp.data;
      this.display = true;
    }).catch(() => {
      this._messageService.add({ severity: 'error', summary: 'error', detail: 'Oops! Something went wrong. Please try again' });
    });
  }

  goToEdit(id) {
    this.router.navigate(['app/user/edit/' + id]);
  }

  onConfirm(id) {
    this._messageService.clear('c');
    this.userService.delete(id).then(() => {
      this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Data deleted successfully' });
      this.getData(1);
    }).catch(() => {
      this._messageService.add({ severity: 'error', summary: 'error', detail: 'Oops! Something went wrong. Please try again' });
    });
  }

  onReject() { this._messageService.clear('c'); }

  delete(id, uid) {
    console.log( id,uid);
    this._messageService.add({
      key: 'c', sticky: true, severity: 'warn', summary: 'Are you sure?', detail: 'Confirm to proceed',
      id: id
    });
    // firebase.auth().signInWithCustomToken(uid)
    // .then(function() {
    //   console.log('Successfully deleted user');
    // })
    // .catch(function(error) {
    //   console.log('Error deleting user:', error);
    // });
    // firebase.auth().signInWithEmailAndPassword(email, pass)
    // .then(function (info) {
    //    var user = firebase.auth().currentUser;
    //    user.delete();
    // });
    // remove(key: string, path: string) {
    //   return this.db.list(this.PATH + path).remove(key);
    // }
  
   
  }
  showDialog(data: any) {
    this.rowdata = data;
    this.display = true;
  }

}
