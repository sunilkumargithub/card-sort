import { Component, OnInit } from '@angular/core';
import { DrawerService, LoginService } from '../../services';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  isDrawerOpen: boolean;
  user: any;
  constructor(
    public router: Router,
    private drawerService: DrawerService,
    private _service: LoginService
  ) { }

  ngOnInit() {
    this._service.currentUser().then(res => {
      this.user = res;
      // console.log(this.user);
    }).catch(error => {
      // console.log(error);
      this.router.navigate(['login']);
    });

    this.drawerService.getDrawerEmitter().subscribe((isDrawerOpen) => {
      this.isDrawerOpen = !this.isDrawerOpen;
    });

  }

}
