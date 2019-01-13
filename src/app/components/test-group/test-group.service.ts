import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { sortBy } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class TestGroupService {

  testgroupCollections: AngularFirestoreCollection<any>;
  testgroupUsersCollections: AngularFirestoreCollection<any>;
  constructor(private _afs: AngularFirestore) {
    this.testgroupCollections = this._afs.collection('test_group', x => x.orderBy('key', 'desc'));
    this.testgroupUsersCollections = this._afs.collection('test_group_user', x => x.orderBy('key', 'desc'));
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
      this._afs.collection('test_group', x => x.where('isDeleted', '==', false)).snapshotChanges().subscribe(res => {
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
      // this._afs.collection('test_group', x => x
      //   .where('isDeleted', '==', false)
      //   .where('title', '==', data['title'])
      //   .where('project', '==', data['project']))
      //   .get()
      //   .subscribe(res => {

      if (data['id']) {
        const updatedId = data['id'];
        delete data['id'];
        data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
        const test_users = data['users'];
        const deleted_test_users = data['users_ids'];
        delete data['users_ids'];
        data['users'] = data['users'].length;
        // console.log(test_users);
        this.testgroupCollections.doc(updatedId).update(data).then(() => {

          deleted_test_users.map(item => {
            this.testgroupUsersCollections.doc(item).delete().then(res => {
            }).catch(err => {
              reject(err);
            });
          });

          test_users.map(item => {
              this.testgroupUsersCollections.add({ project: data.project, test_group: updatedId, code: item.code, isUsed: false });
          });
          resolve();
        }).catch((err) => {
          reject(err);
        });
      } else {
        data.isDeleted = false;
        data.insertedAt = firebase.firestore.FieldValue.serverTimestamp();
        const test_users = data['users'];
        data['users'] = data['users'].length;
        this.testgroupCollections.add(data).then((response) => {
          test_users.map(item => {
            this.testgroupUsersCollections.add({ project: data.project, test_group: response.id, code: item.code, isUsed: false });
          });
          resolve(response);
        }).catch((err) => {
          reject(err);
        });
      }
      // });
    });
  }

  getById(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.testgroupCollections.doc(id).snapshotChanges().subscribe(res => {
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
      this.testgroupCollections.doc(id).update({ isDeleted: true }).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }
}
