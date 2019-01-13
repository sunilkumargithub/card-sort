import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Observable, of } from 'rxjs';
import { Router, RoutesRecognized } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { StorageService } from 'src/app/core/services';

import { filter, pairwise } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private user: Observable<firebase.User>;

  private previousUrl: string;
  private currentUrl: string;
  constructor(private afAuth: AngularFireAuth
    , private _router: Router,
    private _afs: AngularFirestore,
    private storageService: StorageService) {

    // Set previous url
    this._router.events
      .pipe(filter((e: any) => e instanceof RoutesRecognized),
        pairwise()
      ).subscribe((e: any) => {
        this.previousUrl = e[0].urlAfterRedirects;
      });
  }

  public getPreviousUrl() {
    return this.previousUrl;
  }

  login(email: string, password: string): Promise<object> {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
        .then(userdata => {
          // console.log(userdata);
          this._afs.collection('user', x => x
            .where('isDeleted', '==', false)
            .where('Uid', '==', userdata.user.uid))
            .snapshotChanges().subscribe(res => {
              if (res.length > 0) {
                resolve({ id: res[0].payload.doc.id, ...res[0].payload.doc.data() });
              } else {
                reject({ 'message': 'Don\'t have permission in admin.' });
              }
            }, error => {
              reject(error);
            });
        })
        .catch(err => reject(err));
    });
  }

  currentUser(): Promise<object> {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user: firebase.User) => {
        if (user) {
          // console.log(user);
          this._afs.collection('user', x => x
            .where('isDeleted', '==', false)
            .where('Uid', '==', user.uid))
            .snapshotChanges().subscribe(res => {
              // console.log(res);
              if (res.length > 0) {
                resolve({ id: res[0].payload.doc.id, ...res[0].payload.doc.data() });
              } else {
                resolve();
              }

            }, error => {
              reject(error);
            });
        } else {
          reject({ 'message': 'error finding user' });
        }
      });
    });
  }

  forgetPassword(email: string): Promise<object> {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.sendPasswordResetEmail(email)
        .then(res => resolve({ message: 'mail sent successfully.' }))
        .catch(err => reject(err));
    });
  }

  changePassword(code: string, password: string): Promise<object> {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.confirmPasswordReset(code, password)
        .then(res => resolve({ message: 'new password set successfully.' }))
        .catch(err => reject(err));
    });
  }

  isLoggedin(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user: firebase.User) => {
        if (user) {
          resolve(true);
        } else {
          resolve(false);
          this._router.navigate(['/']);
        }
      });
    });
  }

  logOut() {
    this.afAuth.auth.signOut();
    this.storageService.clearUser();
    this._router.navigate(['/']);
  }

  filterCompany(data: any, field: any, subfield?: any): Promise<Array<any>> {
    let filterData = [];
    return new Promise((resolve, reject) => {
      this.currentUser().then(user => {
        if (user['Role'].indexOf('user') > -1) {
          filterData = data.filter(f => {
            if (subfield) {
              return f[field][subfield] === user['company'];
            } else {
              return f[field] === user['company'];
            }
          });
          resolve(filterData);
        } else {
          resolve(data);
        }
      }).catch(error => {
        console.log(error);
        this._router.navigate(['/']);
      });
    });
  }

  // getallclient(): Promise<any> {
  //   const responseData: any = [];
  //   return new Promise((resolve, reject) => {
  //     this._afs.collection('client', x => x.where('isDeleted', '==', false).where('Role', '==', ['client'])
  //     ).snapshotChanges().subscribe(res => {
  //       res.forEach(element => {
  //         const response: any = {};
  //         response['id'] = element.payload.doc.id;
  //         response['data'] = element.payload.doc.data();
  //         responseData.push(response);
  //       });
  //       resolve(responseData);
  //     }, error => {
  //       reject(error);
  //     });
  //   });
  // }


  // getallusers(): Promise<any> {
  //   const responseData: any = [];
  //   return new Promise((resolve, reject) => {
  //     this._afs.collection('user', x => x.where('isDeleted', '==', false).where('Role', '==', ['user'])
  //     ).snapshotChanges().subscribe(res => {
  //       res.forEach(element => {
  //         const response: any = {};
  //         response['id'] = element.payload.doc.id;
  //         response['data'] = element.payload.doc.data();
  //         responseData.push(response);
  //         //  console.log("response",responseData);
  //       });
  //       resolve(responseData);
  //     }, error => {
  //       reject(error);
  //     });
  //   });
  // }

  // async processData() {

  //   const clientCollection = await firebase.firestore().collection(`client`).get();
  //   const jobsCollection = await firebase.firestore().collection(`user`).get();
  //   const clients = [];
  //   clients.push(clientCollection);
  //   clients.push(jobsCollection);
  //   const res = await Promise.all(clients);
  //   console.log("DSF" , res);
  //   // res should equal a combination of both querySnapshots
  // }

}
