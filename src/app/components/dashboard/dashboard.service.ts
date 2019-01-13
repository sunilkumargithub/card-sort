import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import * as csv from 'csvtojson';
import { Observable } from 'rxjs';
import { Upload } from '../../services/upload';
import { sortBy } from 'lodash';

export interface CardItem {
  project: string;
  deck: string;
  title: string;
  points: string;
  card_image: string;
  isDeleted: boolean;
  insertedAt: Date;
}

@Injectable({
  providedIn: 'root'
})

export class DashboardService {

  cardCollection: AngularFirestoreCollection<CardItem>;
  projectCollections: AngularFirestoreCollection<any>;
  deckCollections: AngularFirestoreCollection<any>;

  items: Observable<CardItem[]>;
  private basePath = '/uploads/card';

  constructor(private _afs: AngularFirestore) {
    this.cardCollection = this._afs.collection<CardItem>('card');
    this.projectCollections = this._afs.collection('project', x => x.orderBy('key', 'desc'));
    this.deckCollections = this._afs.collection('project', x => x.orderBy('key', 'desc'));
  }

  pushFileToStorage(upload: Upload): Promise<any> {
    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef.child(`${this.basePath}/${upload.file.name}`).put(upload.file);

    return new Promise((resolve, reject) => {
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {

          // in progress
          const snap = snapshot as firebase.storage.UploadTaskSnapshot;
        },
        (error) => {
          // fail
          console.log(error);
        },
        () => {
          // success
          uploadTask.snapshot.ref.getDownloadURL().then(downloadUrl => {
            upload.url = downloadUrl; // uploadTask.snapshot.downloadURL;
            console.log('downloadUrl', downloadUrl);
            upload.name = uploadTask.snapshot.ref.name;
            resolve(upload);
          });
        }
      );
    });
  }

  textToCsv(text): Promise<any> {
    const hds = new Array();
    const rows = new Array();
    return new Promise(resolve => {
      csv({ noheader: true })
        .fromString(text)
        .then(jsonArr => {
          jsonArr.forEach((row, index) => {
            if (index === 0) {
              Object.keys(row).map(id => hds.push(row[id].toLocaleLowerCase()));
            } else {
              row = Object.keys(row).map(id => row[id]);
              if (row.length !== hds.length) {
                console.log('Ops looks like you have an empty space');
              }
              const newrow = {};
              hds.forEach((head, i) => {
                newrow[head] = row[i];
              });
              rows.push(newrow);
            }
          });
          resolve({ headers: hds, rows: rows });
        })
        .then(tab => {
          resolve(tab);
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
          // console.log('decks', responseData);
        });
        responseData = sortBy(responseData, 'data.insertedAt.seconds').reverse();
        resolve(responseData);
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


  getData(id): Promise<any> {
    return new Promise((resolve, reject) => {
      this._afs.collection('card', x => x
      .where('isDeleted', '==', false)
      .where('project', '==', id)).snapshotChanges().subscribe(res => {
        let responseData: any = [];
        res.forEach(element => {
          const response: any = {};
          response['id'] = element.payload.doc.id;
          response['data'] = element.payload.doc.data();
          this._afs.doc('project/' + element.payload.doc.data()['project']).valueChanges().subscribe(data1 => {
            response['project'] = data1;
          });
          responseData.push(response);
          // console.log('card', responseData);
        });
        responseData = sortBy(responseData, 'data.insertedAt.seconds').reverse();
        resolve(responseData);
      }, error => {
        reject(error);
      });
    });
  }
  getfieldData(id): Promise<any> {
    console.log(id);
    return new Promise((resolve, reject) => {
      this._afs.collection('fielddata', x => x
      // .where('isDeleted', '==', false)
      .where('company', '==', id)).snapshotChanges().subscribe(res => {
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
          // console.log('card', responseData);
        });
        responseData = sortBy(responseData, 'data.insertedAt.seconds').reverse();
        resolve(responseData);
      }, error => {
        reject(error);
      });
    });
  }

  save(data: any): Promise<firebase.firestore.DocumentReference> {
    // console.log(data);
    return new Promise((resolve, reject) => {
      this._afs.collection('card', x => x
        .where('isDeleted', '==', false)
        .where('deck', '==', data['deck'])
        .where('project', '==', data['project'])
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
              this.cardCollection.doc(updatedId).update(data).then(() => {
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
              this.cardCollection.add(data).then((response) => {
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
      this.cardCollection.doc(id).snapshotChanges().subscribe(res => {
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
      this.cardCollection.doc(id).update({ isDeleted: true }).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }


}
