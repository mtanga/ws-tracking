import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { UtilsService } from '../shared/services/utils.service';
import {NgxCroppedEvent, NgxPhotoEditorService} from "ngx-photo-editor";
import { CategoryService } from '../shared/services/category.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs';
import { Category } from '../shared/models/category';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
import { Product } from '../shared/models/product';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ProductService } from '../shared/services/product.service';
import { PayementService } from '../shared/services/payement.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  editor = ClassicEditor;
  data: any = "<p>Hello, world!</p>";
  tab : any = "orders"
  edit : boolean = false;
  edit_a : boolean = false;
  edit_a2 : boolean = false;
  modify : boolean = false;
  modify2 : boolean = false;
  nom : any;
  prenom : any;
  user : any;
  opassword : any;
  cpassword : any;
  password : any;
  showo: boolean = false;
  show: boolean = false;
  showc: boolean = false;
  infos: any;
  phone : any;
  category : any = {
    title : "",
    image : "",
  };

  product : any = {
    id : "",
    title : "",
    category : "",
    description : "",
    image : "",
    link : "",
    price : "",
  }

  image : any;
  myData: any[];
  orders: any;
  desc : any;
  sub: any;
  public loading = false;
  imageError: any;
  imageChangedEvent: any;
  base64: any;
  images: any;
  image_product : any;

  private categoryPath = '/categories';
  private productsPath = '/products';
  categoryRef: AngularFirestoreCollection<Category>;
  productRef: AngularFirestoreCollection<Product>;
  categories: any;
  products: any;
  imgUpdated: boolean = false;
  imgUpdated2: boolean = false;
  paiements: any = [];
  //Ref: AngularFirestoreCollection<Offer>;

  constructor(
    private authService : AuthService,
    private notice : UtilsService,
    private router: Router,
    private route : ActivatedRoute,
    private service: NgxPhotoEditorService,
    private categoryService : CategoryService,
    private productService : ProductService,
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    private payementService : PayementService,
    ) { 
      this.categoryRef = db.collection(this.categoryPath);
      this.productRef = db.collection(this.productsPath);
    }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('userInfos'));
    if(this.user.role!="admin"){
      this.router.navigate(['connexion']);
    }
    this.retrieveCategories();
  }


  retrieveCategories(): void {
    this.categoryService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.categories = data;
      this.getProducts();
      console.log(data);
    });
  }

  getProducts(){
    this.productService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.products = data;
      this.getPaiements();
    });
  }

  getPaiements(){
    this.payementService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.paiements = data;
      console.log("Paiements", data);
    });
  }

  
  fileChangeCategory($event: any){
      this.service.open($event, {
        aspectRatio: 4 / 3,
        autoCropArea: 1
      }).subscribe(data => {
        this.category.image = data.base64;
        console.log("image", data);
      });
    this.imgUpdated = true;
  }


  fileChangeProduct($event: any){
    this.service.open($event, {
      aspectRatio: 4 / 3,
      autoCropArea: 1
    }).subscribe(data => {
      this.product.image = data.base64;
      console.log("image", data);
    });
  this.imgUpdated = true;
}



  addCategory (){
    console.log(this.category.image.length)
    if(this.category.title == "" || this.category.title.length < 5 ){
      console.log("vide ou trop petit");
      this.notice.showError("Le titre est trop petit ou vide.", "Titre de la cat??gorie");
    }
    else if (this.category.image == "" || this.category.image.length == 5){
      console.log("Image vide");
      this.notice.showError("Image vide.", "Image de couverture");
    }
    else {
      this.createCategory();
    }

  }

  addProduct(){
    console.log(this.product);

    if(this.product.title.length < 3){
      this.notice.showError("Le nom est trop petit ou vide.", "Titre du logiciel");
    }
    if(this.product.category.length < 3){
      this.notice.showError("La cat??gorie est vide.", "Cat??gorie du logiciel");
    }
    else if(this.product.price.length < 2){
      this.notice.showError("Le prix est vide.", "Prix");
    }
    else if(this.product.link.length < 5){
      this.notice.showError("Le lien du t??l??chargement est vide.", "Lien");
    }
    else if(this.product.description.length < 5){
      this.notice.showError("La description est vide.", "Description");
    }
    else if(this.product.image.length < 5){
      this.notice.showError("L'image est vide.", "Image de couverture");
    }
    else{
      this.createProduct();
    }
  }

  async createProduct(){
    const { id } = await this.productService.create(this.product);
    let rdN = Math.random().toString(36).substr(2, 9);
      let pic = this.product.image;
      const filePath = `products_photos/${rdN}`;
      const ref = this.storage.ref(filePath);
      const task = ref.putString(pic, 'data_url');
      task.snapshotChanges().pipe(
        finalize(() => {
        ref.getDownloadURL().subscribe(url => {
          this.productRef.doc(id).update(
            {
              image : url,
              id : id
             });
          });   
        })
      ).subscribe();
      this.notice.showSuccess("Produit cr??ee avec succ??s.", "Cat??gorie");
      this.edit_a2=false;

      this.product = {
        title :"",
        category : "",
        image : "",
        id : "",
        description : "",
        link : "",
        price : "",
      }

 }



  cancel(){
    this.edit_a=false;
    this.modify = false;
    this.category = {
      title :"",
      image : "",
      id : ""
    }

  }

  cancel2(){
    this.edit_a2=false;
    this.modify2 = false;
    this.product = {
      title :"",
      category : "",
      image : "",
      id : "",
      description : "",
      link : "",
      price : "",
    }

  }

  async createCategory(){
     const { id } = await this.categoryService.create(this.category);
     let rdN = Math.random().toString(36).substr(2, 9);
       let pic = this.category.image;
       const filePath = `categories_photos/${rdN}`;
       const ref = this.storage.ref(filePath);
       const task = ref.putString(pic, 'data_url');
       task.snapshotChanges().pipe(
         finalize(() => {
         ref.getDownloadURL().subscribe(url => {
           this.categoryRef.doc(id).update(
             {
               image : url,
               id : id
              });
           });   
         })
       ).subscribe();
       this.notice.showSuccess("Cat??gorie cr??ee avec succ??s.", "Cat??gorie");
       this.edit_a=false;

  }

  delete(id){
    this.categoryService.delete(id).then(() => {
      this.notice.showSuccess("Cat??gorie supprim??e avec succ??s.", "Cat??gorie");
    })
  }


  deleteProduct(id){
    this.productService.delete(id).then(() => {
      this.notice.showSuccess("Produit supprim?? avec succ??s.", "Produit");
    })
  }


  updateProduct(item){
    this.product = {
      title : item.title,
      image : item.image,
      id : item.id,
      description : item.description,
      link : item.link,
      price : item.price,
    }
    this.edit_a2=true;
    this.modify2=true;
  }



  updatePro(item){
    if(this.imgUpdated == true){
      let rdN = Math.random().toString(36).substr(2, 9);
      let pic = this.product.image;
      const filePath = `categories_photos/${rdN}`;
      const ref = this.storage.ref(filePath);
      const task = ref.putString(pic, 'data_url');
      task.snapshotChanges().pipe(
        finalize(() => {
        ref.getDownloadURL().subscribe(url => {
          this.productRef.doc(this.product.id).update(
            {
              image : url,
              title : this.product.title,
              description : this.product.description,
              link : this.product.link,
              price : this.product.price,
             });
          });   
        })
      ).subscribe();

      this.product = {
        title :"",
        category : "",
        image : "",
        id : "",
        description : "",
        link : "",
        price : "",
      }
      this.edit_a2=false;
      this.notice.showSuccess("Produit modifi??e avec succ??s.", "Produit");
    }
    else{
        this.productRef.doc(this.product.id).update(
            {
              title : this.product.title,
              description : this.product.description,
              link : this.product.link,
              price : this.product.price,
             });

             this.product = {
              title :"",
              category : "",
              image : "",
              id : "",
              description : "",
              link : "",
              price : "",
            }
        this.edit_a2=false;
        this.notice.showSuccess("Produit modifi??e avec succ??s.", "Produit");
    }
  }


  update(item){
    this.category = {
      title : item.title,
      image : item.image,
      id : item.id
    }
    this.edit_a=true;
    this.modify=true;
  }

  updateCategory(item){
    if(this.imgUpdated == true){
      let rdN = Math.random().toString(36).substr(2, 9);
      let pic = this.category.image;
      const filePath = `categories_photos/${rdN}`;
      const ref = this.storage.ref(filePath);
      const task = ref.putString(pic, 'data_url');
      task.snapshotChanges().pipe(
        finalize(() => {
        ref.getDownloadURL().subscribe(url => {
          this.categoryRef.doc(this.category.id).update(
            {
              image : url,
              title : this.category.title
             });
          });   
        })
      ).subscribe();

      this.category = {
        title : "",
        image : "",
        id : ""
      }
      this.edit_a=false;
      this.notice.showSuccess("Cat??gorie modifi??e avec succ??s.", "Cat??gorie");
    }
    else{
        this.categoryRef.doc(this.category.id).update(
            {
              title : this.category.title
             });

        this.category = {
          title : "",
          image : "",
          id : ""
        }
        this.edit_a=false;
        this.notice.showSuccess("Cat??gorie modifi??e avec succ??s.", "Cat??gorie");
    }
  }






  getCountries(){

  }


  onCountryChange($event){
    console.log("onCountryChange", $event );
  }

  getNumber($event){
    console.log("Get number", $event );
    this.phone = $event;

  }

  telInputObject($event){
    console.log("telInputObject", $event );
  }

  hasError($event){
    this.phone=null 
  }

getAdresse(user: any) {
  let data = {
    user : user
  }

}

getorders(){
  let data = {
    user : this.user.id
  }

}

passwordo() {
    this.showo = !this.showo;
}

passwordc() {
  this.showc = !this.showc;
}

passwordv() {
  this.show = !this.show;
}

logout(){
  this.authService.SignOut();
  this.router.navigate(['/connexion']);
  this.notice.showWarning("Vous n'??tes plus connect??", "D??connexion")
}

  profile(f){
    let data ={
      last_name : f.form.value.nom,
      fisrt_name : f.form.value.prenom,
      id : this.user.id
    }

  }


  editadresse(f){



  }




  pass(){
    if (this.password == "" || this.password == undefined || this.password.length < 6) {
      this.notice.showError("Votre mot de passe est court!", "S??curit??")
    } 
    if(this.password != this.cpassword){
      this.notice.showError("Mots de passe diff??rents", "S??curit??")
    }
    else{

    }
    let data ={
      password : this.opassword,
      current : this.password
    }
  
  }

}
