import { Injectable, Inject } from '@angular/core';
import { APP_CONFIG } from '../../../app.config';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  USER_SESSION_KEY: string;

  constructor(
    @Inject(APP_CONFIG) private config: any,
  ) {
    this.USER_SESSION_KEY = this.config.USER_SESSION_KEY;
  }

  setUser(data: any) {
    sessionStorage.setItem(this.USER_SESSION_KEY, JSON.stringify(data));
  }

  getUser() {
    return JSON.parse(sessionStorage.getItem(this.USER_SESSION_KEY));
  }

  clearUser() {
    return sessionStorage.removeItem(this.USER_SESSION_KEY);
  }
}
