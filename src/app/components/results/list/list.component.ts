import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  display: boolean;
  rowdata: any;

  rows = [
    { name: 'Dummy Participant', status: 'success' },
    { name: 'Test Participant', status: 'danger' },
    { name: 'Rest Participant', status: 'warning' },
  ];

  constructor() {
    this.display = false;
  }

  ngOnInit() {
  }

  showDialog(data: any) {
    this.rowdata = data;
    this.display = true;
  }

}
