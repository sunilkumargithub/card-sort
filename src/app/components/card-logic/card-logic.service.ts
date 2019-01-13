import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';


export interface CardLogicItem {
  project: string;
  condition: string;
  deck: string;
  from_deck: string;
  from_card: string;
  to_deck: string;
  to_card: string;
  isDeleted: boolean;
  insertedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CardLogicService {
  cardLogicCollections: AngularFirestoreCollection<CardLogicItem>;

  items: Observable<CardLogicItem[]>;


  constructor(private _afs: AngularFirestore) {
    this.cardLogicCollections = this._afs.collection<CardLogicItem>('card_logic', x => x.orderBy('key', 'desc'));
  }

  getAllProject(): Promise<any> {
    const responseData: any = [];
    return new Promise((resolve, reject) => {
      this._afs.collection('project', x => x.where('isDeleted', '==', false)).snapshotChanges().subscribe(res => {
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

  getAllDecks(): Promise<any> {
    const responseData: any = [];
    return new Promise((resolve, reject) => {
      this._afs.collection('deck').snapshotChanges().subscribe(res => {
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

  getAllCondition(): Promise<any> {
    const responseData: any = [];
    return new Promise((resolve, reject) => {
      this._afs.collection('logic_condition').snapshotChanges().subscribe(res => {
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

  getCardByProjectAndDeck(deck: any, project: any): Promise<any> {
    const responseData: any = [];
    return new Promise((resolve, reject) => {
      this._afs.collection('card', x =>
        x.where('deck', '==', deck)
          .where('project', '==', project))
        .snapshotChanges()
        .subscribe(res => {
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

  getData(id): Promise<any> {
    const responseData: any = [];
    return new Promise((resolve, reject) => {
      this._afs.collection('card_logic', x => x
        .where('isDeleted', '==', false)
        .where('project', '==', id)).snapshotChanges().subscribe(res => {
          res.forEach(element => {
            const response: any = {};
            response['id'] = element.payload.doc.id;
            response['data'] = element.payload.doc.data();

            this._afs.doc('project/' + element.payload.doc.data()['project']).valueChanges().subscribe(data1 => {
              response['project'] = data1;
            });

            this._afs.doc('logic_condition/' + element.payload.doc.data()['condition']).valueChanges().subscribe(data1 => {
              response['condition'] = data1;
            });

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
      this._afs.collection('card', x => x
        .where('isDeleted', '==', false)
        .where('deck', '==', data['deck'])
        .where('project', '==', data['project'])
        .where('condition', '==', data['condition']))
        .get()
        .subscribe(res => {
          if (data['id']) {
            const updatedId = data['id'];
            delete data['id'];
            data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
            this.cardLogicCollections.doc(updatedId).update(data).then(() => {
              resolve();
            }).catch((err) => {
              reject(err);
            });

          } else {
            data.isDeleted = false;
            data.insertedAt = firebase.firestore.FieldValue.serverTimestamp();
            this.cardLogicCollections.add(data).then((response) => {
              resolve(response);
            }).catch((err) => {
              reject(err);
            });
          }
        });
    });

  }

  getById(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.cardLogicCollections.doc(id).snapshotChanges().subscribe(res => {
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
      this.cardLogicCollections.doc(id).update({ isDeleted: true }).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  }
}
