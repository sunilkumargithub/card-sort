import { Component, OnInit, Input } from '@angular/core';
import { DrawerService } from '../../services/drawer/drawer.service';
import { MenuItem } from 'primeng/api';
import { Router, NavigationStart } from '@angular/router';
import { StorageService, LoginService } from '../../services';


@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

    isDrawerOpen: boolean;
    public show = false;
    items: MenuItem[];
    loggeduser: any;
    userdisplay: boolean;
    @Input() user: any;

    constructor(private drawerService: DrawerService,
        public router: Router,
        private storageService: StorageService,
        private _service: LoginService) {
        this.userdisplay = true;
    }

    ngOnInit() {
        const roles = this.user['Role'];
        if (roles.indexOf('superadmin') > -1) {
            this.items = [
                {
                    label: 'Add New Field',
                    icon: 'fa fa-building',
                    routerLink: '/app/company',
                },
                {
                    label: 'Add Month',
                    icon: 'fa fa-user',
                    routerLink: '/app/category',
                },
                {
                    label: 'Add New Expense',
                    icon: 'fa fa-user',
                    routerLink: '/app/user',
                }, 
                  {
                    label: 'Dashboard',
                    icon: 'fa fa-user',
                    routerLink: '/app/dashboard',
                },
                // {
                //     label: 'Client Management',
                //     icon: 'fa fa-user-circle',
                //     routerLink: '/app/client',
                // },
                // {
                //     label: 'Color Management',
                //     icon: 'fa fa-paint-brush',
                //     routerLink: '/app/color',
                // },
                // {
                //     label: 'Project Management',
                //     icon: 'fa fa-tasks',
                //     routerLink: '/app/project',
                // },
                // {
                //     label: 'Group Management',
                //     icon: 'fa fa-users',
                //     routerLink: '/app/test-group',
                // // },
                // {
                //     label: 'Deck Management',
                //     icon: 'fa fa-cog',
                //     routerLink: '/app/deck',
                // },
                // {
                //     label: 'Card Management',
                //     icon: 'fa fa-id-card',
                //     routerLink: '/app/card',
                // },
                // {
                //     label: 'Card Logic',
                //     icon: 'fa fa-id-card',
                //     routerLink: '/app/card_logic',
                // },
                // {
                //     label: 'Results',
                //     icon: 'fa fa-file-text',
                //     routerLink: '/app/result',
                // },
            ];
        } else {
            this.items = [
                {
                    label: 'User Management',
                    icon: 'fa fa-user-plus',
                    routerLink: '/app/user',
                },
                {
                    label: 'Company Management',
                    icon: 'fa fa-building',
                    routerLink: '/app/company',
                },
                {
                    label: 'Brand Management',
                    icon: 'fa fa-user',
                    routerLink: '/app/category',
                },
                // {
                //     label: 'Client Management',
                //     icon: 'fa fa-user-circle',
                //     routerLink: '/app/client',
                // },
                {
                    label: 'Color Management',
                    icon: 'fa fa-paint-brush',
                    routerLink: '/app/color',
                },
                {
                    label: 'Project Management',
                    icon: 'fa fa-tasks',
                    routerLink: '/app/project',
                },
                // {
                //     label: 'Group Management',
                //     icon: 'fa fa-users',
                //     routerLink: '/app/test-group',
                // },
                {
                    label: 'Deck Management',
                    icon: 'fa fa-cog',
                    routerLink: '/app/deck',
                },
                {
                    label: 'Card Management',
                    icon: 'fa fa-id-card',
                    routerLink: '/app/card',
                },
                {
                    label: 'Card Logic',
                    icon: 'fa fa-id-card',
                    routerLink: '/app/card_logic',
                },
                {
                    label: 'Results',
                    icon: 'fa fa-file-text',
                    routerLink: '/app/result',
                },
            ];
        }

        // Drawer Service Getting Close and Opening Funcationality
        this.drawerService.getDrawerEmitter().subscribe((isDrawerOpen) => {
            this.isDrawerOpen = !this.isDrawerOpen;
        });

        // Menu Items Json Format
    }
}
