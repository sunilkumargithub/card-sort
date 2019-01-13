import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { sortBy } from 'lodash';


export interface CategoryItem {
  category: string;
  companyName: string;
  isDeleted: boolean;
  insertedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private itemsCollection: AngularFirestoreCollection<CategoryItem>;
  items: Observable<CategoryItem[]>;
  constructor(
    private _afs: AngularFirestore,
    private _http: HttpClient
  ) {
    this.itemsCollection = _afs.collection<CategoryItem>('category');
  }

  getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._afs.collection('category', x => x
        .where('isDeleted', '==', false))
        .snapshotChanges().subscribe(res => {
          let responseData: any = [];
          res.forEach(element => {
            const response: any = {};
            response['id'] = element.payload.doc.id;
            response['data'] = element.payload.doc.data();

            this._afs.doc('company/' + element.payload.doc.data()['company']).valueChanges().subscribe(data => {
              response['company'] = data;
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

  getAllCompany(): Promise<any> {
    let responseData: any = [];
    return new Promise((resolve, reject) => {
      this._afs.collection('company', x => x.where('isDeleted', '==', false)).snapshotChanges().subscribe(res => {
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

  save(data: any): Promise<firebase.firestore.DocumentReference> {
    return new Promise((resolve, reject) => {
      this._afs.collection('category', x => x
        .where('isDeleted', '==', false)
        .where('company', '==', data['company'])
        .where('category', '==', data['category']))
        .get()
        .subscribe(res => {
          if (data['id']) {
            if (!res.empty && res.docs[0].id !== data['id']) {
              reject({ message: 'month already registered.' });
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
              reject({ message: 'category already used.' });
            } else {
              data.isDeleted = false;
              data.insertedAt = firebase.firestore.FieldValue.serverTimestamp();
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
