
import { Injectable, EventEmitter } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { sortBy } from 'lodash';


export interface UserItem {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address: string;
  isDeleted: boolean;
  insertedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private itemsCollection: AngularFirestoreCollection<UserItem>;
  items: Observable<UserItem[]>;
  constructor(
    private _afs: AngularFirestore,
    private _http: HttpClient
  ) {
    this.itemsCollection = _afs.collection<UserItem>('user');
  }

  isSuperadminCredentialGiven: EventEmitter<boolean> = new EventEmitter();

  setSuperadminCredential(isSet: boolean) {
    this.isSuperadminCredentialGiven.emit(isSet);
  }

  getSuperadminCredential(): Observable<boolean> {
    return this.isSuperadminCredentialGiven;
  }

  getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._afs.collection('fielddata', x => x
        // .where('isDeleted', '==', false)
        // .where('Role', 'array-contains', 'user')
      )
        .snapshotChanges().subscribe(res => {
          let responseData: any = [];
          res.forEach(element => {
            const response: any = {};
            response['id'] = element.payload.doc.id;
            response['data'] = element.payload.doc.data();
            this._afs.collection('company').doc(response['data']['company'])
              .valueChanges().subscribe(company => {
                response['data']['company_details'] = company;
              });

            this._afs.collection('category').doc(response['data']['category'])
              .valueChanges().subscribe(category => {
                response['data']['category_details'] = category;
              });

            responseData.push(response);
          });
          responseData = sortBy(responseData, 'data.insertedAt.seconds').reverse();
          resolve(responseData);
        }, error => {
          reject(error);
        });
    });
  }

  getAllCategory(id): Promise<any> {
    return new Promise((resolve, reject) => {
      this._afs.collection('category', x => x
        .where('isDeleted', '==', false)
        .where('company', '==', id))
        .snapshotChanges().subscribe(res => {
          let responseData: any = [];
          res.forEach(element => {
            const response: any = {};
            response['id'] = element.payload.doc.id;
            response['data'] = element.payload.doc.data();
            responseData.push(response);
          });
          responseData = sortBy(responseData, 'data.insertedAt.seconds').reverse();
          resolve(responseData);
        }, error => {
          reject(error);
        });
    });
  }

  getAllCompanies(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._afs.collection('company', x => x
        .where('isDeleted', '==', false))
        .snapshotChanges().subscribe(res => {
          let responseData: any = [];
          res.forEach(element => {
            const response: any = {};
            response['id'] = element.payload.doc.id;
            response['data'] = element.payload.doc.data();
            responseData.push(response);
          });
          responseData = sortBy(responseData, 'data.insertedAt.seconds').reverse();
          resolve(responseData);
        }, error => {
          reject(error);
        });
    });
  }

  savefielddata(data: any): Promise<firebase.firestore.DocumentReference> {
    return new Promise((resolve, reject) => {
      this._afs.collection('fielddata').add(data).then((res)=> {
        resolve(res);
      }, error=> {
reject(error);
      }
      );
    });
  }
  save(data: any, uid: any): Promise<firebase.firestore.DocumentReference> {
    return new Promise((resolve, reject) => {
      this._afs.collection('user', x => x
        .where('isDeleted', '==', false)
        .where('company', '==', data['company'])
        .where('category', '==', data['category'])
        .where('email', '==', data['email']))
        .get()
        .subscribe(res => {
          if (data['id']) {
            if (!res.empty && res.docs[0].id !== data['id']) {
              reject({ message: 'email already used.' });
            } else {
              const updatedId = data['id'];
              delete data['id'];
              data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
              this.itemsCollection.doc(updatedId).update(data).then(() => {
                resolve();
              }).catch((err) => {
                reject(err);
              });
            }
          } else {
            if (!res.empty) {
              reject({ message: 'email already used.' });
            } else {
              data.isDeleted = false;
              data.insertedAt = firebase.firestore.FieldValue.serverTimestamp();
              delete data.password;
              data.Uid = uid;
              data.Role = ['user'];
              this.itemsCollection.add(data).then((response) => {
                resolve(response);
              }).catch((err) => {
                reject(err);
              });
            }
          }
        });
    });
  }


  getById(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.itemsCollection.doc(id).snapshotChanges().subscribe(res => {
        const response: any = {};
        response['id'] = res.payload.id;
        response['data'] = res.payload.data();
        resolve(response);
      }, error => {
        reject(error);
      });
    });
  }

  delete(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.itemsCollection.doc(id).update({ isDeleted: true }).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }
}
