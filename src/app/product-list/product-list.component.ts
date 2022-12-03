import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { PayementService } from '../shared/services/payement.service';
import { UtilsService } from '../shared/services/utils.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  user: any = [];
  product: any = [];
  totalt: number = 0;
  buy : boolean = false;


  payementRef: AngularFirestoreCollection<any>;
  private productsPath = '/payements';
  constructor(
    private payementService : PayementService,
    private router: Router,
    private db: AngularFirestore,
    public noticeService : UtilsService
  ) {
    this.payementRef = db.collection(this.productsPath);
   }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('userInfos'));
   // console.log(this.user);
    this.getCart();
  }

  getCart(){
    this.product = JSON.parse(localStorage.getItem('the_soft_cart'));
    console.log("Panier", this.product);
    //console.log("Panier 2", this.product[0]);
  }

  totalAmount() {
    this.totalt = 0;
    var test = localStorage.getItem('the_soft_cart');
    let arr = JSON.parse(test);
  //  console.log('mon tableau', arr)
    if(arr!=null){
      for (let i=0;i<arr.length;i++){
        let totalP = 0;
        totalP = arr[i].qte * arr[i].product.price;
        this.totalt = this.totalt+(arr[i].qte * arr[i].product.price);
      //  console.log('mon i:',i, totalP);
      //  console.log('mon total',this.totalt);
      } 
    }
    return this.totalt;
  }

  async payNow(){
    let data = {
      cart : this.product,
      total : this.totalAmount(),
      dateCreated : new Date(),
      user : this.user,
      user_uid : this.user.uid,
      id :""
    }
    const { id } = await this.payementService.create(data);
    this.payementRef.doc(id).update(
      {
        id : id
       });
      localStorage.removeItem('the_soft_cart');
      this.noticeService.buy = true;
      this.router.navigate(['/mom-compte']);

  }

}
