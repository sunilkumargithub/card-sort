import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CanActivate, CanActivateChild, CanLoad } from '@angular/router';
import { LoginService } from '../login/login.service';
import * as firebase from 'firebase/app';
@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate, CanActivateChild, CanLoad {

  constructor(private _service: LoginService) { }

  canActivate(): boolean | Observable<boolean> | Promise<boolean> {
    return this._service.isLoggedin();
  }

  canActivateChild(): boolean | Observable<boolean> | Promise<boolean> {
    return this._service.isLoggedin();
  }

  canLoad(): boolean | Observable<boolean> | Promise<boolean> {
    return this._service.isLoggedin();
  }

  doRegister(value) {
    // console.log(value);
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
        .then(res => {
          resolve(res);
        }, err => reject(err));
    });
  }
}
