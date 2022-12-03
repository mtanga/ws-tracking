import { Injectable } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, map, take } from 'rxjs/operators';
import {formatDate} from '@angular/common';
import * as firebase from 'firebase/compat';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private dbPath = '/users';


  Ref: AngularFirestoreCollection<User>;
  images: any = [];
  userItem: any;


  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    ) {
    this.Ref = db.collection(this.dbPath);
  }

  
  getAll(): AngularFirestoreCollection<User> {
    return this.Ref;
  }


  getOne(id) {
    return this.Ref.doc(id).ref.get();
  }

  getUser(user): AngularFirestoreCollection<User> {
    return this.db.collection('users', ref => ref.where('uid', '==', user));
  }


  GetUserItem(user){
    console.log("Id ici", user)
    //var subject = new Subject<string>();
   return this.getUser(user).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    )
  }



  update(id: string, data: any): Promise<void> {
    return this.Ref.doc(id).update(data);
  }

  like(id: string, data: any): Promise<void> {
    return this.Ref.doc(id).update(data);
  }
  
  delete(id: string): Promise<void> {
    return this.Ref.doc(id).delete();
  }

  updatePhoto(id, image){
  // console.log("id", id)
      let rdN = Math.random().toString(36).substr(2, 9);
      let pic = image;
      const filePath = `user_photos/${rdN}`;
      const ref = this.storage.ref(filePath);

      const task = ref.putString(pic, 'data_url');
      task.snapshotChanges().pipe(
        finalize(() => {
        ref.getDownloadURL().subscribe(url => {
          console.log("Image ici cici", url)
          this.Ref.doc(id).update(
            {
              photoURL : url
            }
          );
          });   
          //this.presentToast("Votre image a été mise à jour");
        })
      ).subscribe();
      return "Avec succès! "
    }


}

