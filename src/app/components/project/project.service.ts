import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { sortBy } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  projectCollections: AngularFirestoreCollection<any>;
  // clientCollections: AngularFirestoreCollection<any>;
  // deckCollections: AngularFirestoreCollection<any>;
  constructor(private _afs: AngularFirestore) {
    // this.clientCollections = this._afs.collection('client', x => x.orderBy('key', 'desc'));
    // this.deckCollections = this._afs.collection('deck', x => x.orderBy('key', 'desc'));
    this.projectCollections = this._afs.collection('project', x => x.orderBy('key', 'desc'));
  }

  getAllClient(): Promise<any> {
    let responseData: any = [];
    return new Promise((resolve, reject) => {
      this._afs.collection('client', x => x.where('isDeleted', '==', false)).snapshotChanges().subscribe(res => {
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

  getAllDecks(): Promise<any> {
    let responseData: any = [];
    return new Promise((resolve, reject) => {
      this._afs.collection('deck').snapshotChanges().subscribe(res => {
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

  getAllColors(): Promise<any> {
    const responseData: any = [];
    return new Promise((resolve, reject) => {
      this._afs.collection('color').snapshotChanges().subscribe(res => {
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

  getData(): Promise<any> {
    let responseData: any = [];
    return new Promise((resolve, reject) => {
      this._afs.collection('project', x => x.where('isDeleted', '==', false)).snapshotChanges().subscribe(res => {
        res.forEach(element => {
          const response: any = {};
          response['id'] = element.payload.doc.id;
          response['data'] = element.payload.doc.data();

          this._afs.doc('client/' + element.payload.doc.data()['client']).valueChanges().subscribe(data1 => {
            response['client'] = data1;
          });
          this._afs.doc('company/' + element.payload.doc.data()['company']).valueChanges().subscribe(data2 => {
            response['company'] = data2;
          });

          this._afs.collection('test_group', x => x
            .where('isDeleted', '==', false)
            .where('project', '==', element.payload.doc.id))
            .snapshotChanges().subscribe(data3 => {
              const test_group_details = [];
              data3.forEach(element1 => {
                this._afs.collection('test_group_user', x => x
                  .where('project', '==', element.payload.doc.id)
                  .where('test_group', '==', element1.payload.doc.id))
                  .valueChanges().subscribe(data4 => {
                    // response['test_group_code'] = data4;
                    const details = { id: element1.payload.doc.id, test_group_user: data4, ...element1.payload.doc.data() };
                    test_group_details.push(details);
                  });
              });
              response['test_group_details'] = test_group_details;
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

  save(data: any): Promise<firebase.firestore.DocumentReference> {
    return new Promise((resolve, reject) => {
      this._afs.collection('project', x => x
        .where('isDeleted', '==', false)
        .where('title', '==', data['title']))
        .get()
        .subscribe(res => {
          if (data['id']) {
            if (!res.empty && res.docs[0].id !== data['id']) {
              reject({ message: 'title already used.' });
            } else {
              const updatedId = data['id'];
              delete data['id'];
              data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
              this.projectCollections.doc(updatedId).update(data).then(() => {
                resolve();
              }).catch((err) => {
                reject(err);
              });
            }
          } else {
            if (!res.empty) {
              reject({ message: 'title already used.' });
            } else {
              data.isDeleted = false;
              data.insertedAt = firebase.firestore.FieldValue.serverTimestamp();
              this.projectCollections.add(data).then((response) => {
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
      this.projectCollections.doc(id).snapshotChanges().subscribe(res => {
        const response: any = {};
        const groups: any = [];
        response['id'] = res.payload.id;
        response['data'] = res.payload.data();
        this._afs.collection('test_group', x => x
          .where('isDeleted', '==', false)
          .where('project', '==', id)).snapshotChanges().subscribe(test_grups => {
            test_grups.forEach(element => {

              const ids: any = [];
              this._afs.collection('test_group_user', x => x.where('test_group', '==', element.payload.doc.id)).get().subscribe(res1 => {
                res1.docs.forEach(elem => {
                  ids.push(elem.id);
                });
                const obj = { id: element.payload.doc.id, ...element.payload.doc.data(), users_ids: ids };
                groups.push(obj);
              });
            });
            response['data']['groups'] = groups;
          }, err => {
            reject(err);
          });
        resolve(response);
      }, error => {
        reject(error);
      });
    });
  }

  delete(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.projectCollections.doc(id).update({ isDeleted: true }).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }

}
