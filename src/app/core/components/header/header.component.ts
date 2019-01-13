import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { LoginService, DrawerService, StorageService } from '../../services';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  
  public show = false;
  // user: any;
  isDrawerOpen: boolean;
  @Input() user: any;

  constructor(
    public router: Router,
    private storageService: StorageService,
    private drawerService: DrawerService,
    private _service: LoginService,
  ) {
    this.user = null;
    this.isDrawerOpen = false;
    this.drawerService.setDrawer(this.isDrawerOpen);
  }

  visibleSidebar() {
    if (this.isDrawerOpen) {
      this.isDrawerOpen = false;
      this.show = false;
    } else {
      this.show = true;
    }
    this.drawerService.setDrawer(this.isDrawerOpen);
    // alert('this');
  }

  ngOnInit() {
  }

  onLogout(ev: any): void {
    this._service.logOut();
  }

}
