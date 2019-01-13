import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { LoginComponent, ChangePasswordComponent } from './core/components';
import { MainComponent } from './core/components/main/main.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'change_password',
        component: ChangePasswordComponent,
    },
    {
        path: 'app',
        loadChildren: './components/components.module#ComponentsModule',
        component: MainComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }

