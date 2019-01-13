import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { DeckService, DeckItem } from '../deck.service';
import { LoginService } from '../../../core/services';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  display: boolean;
  rows = [];
  viewData: DeckItem;

  constructor(
    private router: Router,
    private deckService: DeckService,
    private _messageService: MessageService,
    private spinner: NgxSpinnerService,
    private _loginService: LoginService
  ) {
    this.display = false;
    this.viewData = {
      title: '',
      description: '',
      insertedAt: new Date,
      isDeleted: false
    };
    this.getData();
  }

  ngOnInit() { }

  getData() {
    this.spinner.show();
    this.deckService.getData().then(resp => {
      this._loginService.filterCompany(resp, 'data', 'company').then(filtered => {
        this.rows = filtered;
        this.spinner.hide();
      });
    }).catch(err => {
      console.log(err);
      this.spinner.hide();
    });
  }

  goToEdit(id) {
    this.router.navigate(['app/deck/edit/' + id]);
  }

}
