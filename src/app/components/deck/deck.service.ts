import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { sortBy } from 'lodash';
export interface DeckItem {
  title: string;
  description: string;
  insertedAt: Date;
  isDeleted: false;
}


@Injectable({
  providedIn: 'root'
})
export class DeckService {

  private itemsCollection: AngularFirestoreCollection<DeckItem>;
  items: Observable<DeckItem[]>;

  constructor(
    private _afs: AngularFirestore,
  ) {
    this.itemsCollection = _afs.collection<DeckItem>('project');
  }

  getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._afs.collection('project').snapshotChanges().subscribe(res => {
        const responseData: any = [];
        res.forEach(element => {
          const response: any = {};
          response['id'] = element.payload.doc.id;
          response['data'] = element.payload.doc.data();
          responseData.push(response);
        });
        resolve(responseData);
      }, error => {
        reject(error);
      });
    });
  }

  getAllColors(): Promise<any> {
    const responseData: any = [];
    return new Promise((resolve, reject) => {
      this._afs.collection('color', z => z.where('isDeleted', '==', false)).snapshotChanges().subscribe(res => {
        res.forEach(element => {
          const response: any = {};
          response['id'] = element.payload.doc.id;
          response['data'] = element.payload.doc.data();
          responseData.push(response);
        });
        resolve(responseData);
      }, error => {
        reject(error);
      });
    });
  }

  save(data: any): Promise<firebase.firestore.DocumentReference> {
    return new Promise((resolve, reject) => {
      if (data['id']) {
        const updatedId = data['id'];
        delete data['id'];
        data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
        console.log(data);
        this.itemsCollection.doc(updatedId).update(data).then(() => {
          resolve();
        }).catch((err) => {
          reject(err);
        });
      } else {
        data.isDeleted = false;
        data.insertedAt = firebase.firestore.FieldValue.serverTimestamp();
        this.itemsCollection.add(data).then((response) => {
          resolve(response);
        }).catch((err) => {
          reject(err);
        });
      }
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

  getAllProject(): Promise<any> {
    let responseData: any = [];
    return new Promise((resolve, reject) => {
      this._afs.collection('project', x => x.where('isDeleted', '==', false)).snapshotChanges().subscribe(res => {
        res.forEach(element => {
          const response: any = {};
          response['id'] = element.payload.doc.id;
          response['data'] = element.payload.doc.data();
          responseData.push(response);
          // console.log('projects', responseData);
        });
        responseData = sortBy(responseData, 'data.insertedAt.seconds').reverse();
        resolve(responseData);
      }, error => {
        reject(error);
      });
    });
  }

}
