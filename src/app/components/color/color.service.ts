import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { sortBy } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  colorsCollection: AngularFirestoreCollection<any>;
  constructor(private _afs: AngularFirestore,
    private _http: HttpClient) {
    this.colorsCollection = this._afs.collection('color', x => x.orderBy('key', 'desc'));
  }

  getData(): Promise<any> {
    let responseData: any = [];
    return new Promise((resolve, reject) => {
      this._afs.collection('color', x => x.where('isDeleted', '==', false)).snapshotChanges().subscribe(res => {
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
      this._afs.collection('color', x => x
        .where('code', '==', data['code'])
        .where('color', '==', data['color']))
        .get()
        .subscribe(res => {
          if (data['id']) {
            if (!res.empty && res.docs[0].id !== data['id']) {
              reject({ message: 'Color already exists.' });
            } else {
              const updatedId = data['id'];
              delete data['id'];
              data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
              this.colorsCollection.doc(updatedId).update(data).then(() => {
                resolve();
              }).catch((err) => {
                reject(err);
              });
            }
          } else {
            if (!res.empty) {
              reject({ message: 'Color already exists..' });
            } else {
              data.isDeleted = false;
              data.insertedAt = firebase.firestore.FieldValue.serverTimestamp();
              this.colorsCollection.add(data).then((response) => {
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
      this.colorsCollection.doc(id).snapshotChanges().subscribe(res => {
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
      this.colorsCollection.doc(id).update({ isDeleted: true }).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }
}
