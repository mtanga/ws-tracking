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
import { Category } from '../models/category';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class PayementService {

  private dbPath = '/payements';


  Ref: AngularFirestoreCollection<Product>;
  images: any = [];


  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    ) {
    this.Ref = db.collection(this.dbPath);
  }

  
  getAll(): AngularFirestoreCollection<any> {
    return this.db.collection('payements');
  }


  getAllss(id): AngularFirestoreCollection<Product> {
    //return this.Ref;
    return this.db.collection('payements', ref => ref.where('user_uid', '==', id));
  }

  getCategory(id): AngularFirestoreCollection<Product> {
    //return this.Ref;
    return this.db.collection('products', ref => ref.where('category', '==', id));
  }

  getAlls(): AngularFirestoreCollection<Product> {
    return this.Ref;
    //return this.db.collection('offers', ref => ref.where('visible', '==', false));
  }


  getOne(id) {
    return this.Ref.doc(id).ref.get();
  }

  create(item): any {     
     return this.Ref.add({ ...item });
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

  storeImages(images){
    console.log("images ici 1", images)
    let rdN = Math.random().toString(36).substr(2, 9);
    images.photoURL.forEach(image => {
      //console.log(image.webviewPath);
      let pic = image.webviewPath;
      const filePath = `offer_photos/${rdN}`;
      const ref = this.storage.ref(filePath);

      const task = ref.putString(pic, 'data_url');
      task.snapshotChanges().pipe(
        finalize(() => {
        ref.getDownloadURL().subscribe(url => {
          this.images.push(url);
          console.log("Votre image", url);
          });   
        })
      )//.subscribe();

      
    }, (err) => {
      console.log(err);
     })


    }
   

}



