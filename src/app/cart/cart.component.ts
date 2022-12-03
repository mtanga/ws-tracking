import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '../shared/services/utils.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  product : any = [];
  totalt: number;

  constructor(
    private notice : UtilsService,
    private router:Router,
  ) { }

  ngOnInit(): void {
    this.getCart();
  }

  total(number, qte){
    return parseInt(number)*parseInt(qte);
  }

  getCart(){
    this.product = JSON.parse(localStorage.getItem('the_soft_cart'));
    console.log("Mon panier", this.product);
  }


  remove(item){
    var test = localStorage.getItem('the_soft_cart');
    let arr = JSON.parse(test);
    console.log(item)
    for (let i=0;i<arr.length;i++){
      if(arr[i].id==item.id){
        console.log("troue");
        if(arr[i].qte>1){
          arr[i].qte = arr[i].qte-1;
          console.log('nouveau', arr);
          let json = JSON.stringify(arr);
          localStorage.setItem('the_soft_cart', json); 
          //this.total=this.getotal(arr);
          this.getCart();
          this.notice.showError("Logiciel retiré de votre package.", "Package");
        }
      }
    } 
  }


  totalAmount() {
    this.totalt = 0;
    var test = localStorage.getItem('the_soft_cart');
    let arr = JSON.parse(test);
    console.log('mon tableau', arr)
    if(arr!=null){
      for (let i=0;i<arr.length;i++){
        let totalP = 0;
        totalP = arr[i].qte * arr[i].product.price;
        this.totalt = this.totalt+(arr[i].qte * arr[i].product.price);
        console.log('mon i:',i, totalP);
        console.log('mon total',this.totalt);
      } 
    }
    return this.totalt;
  }

  pay(){
    this.router.navigate(['/pay']);
  }



  supprimer(items){
    console.log("items", items);
    if(confirm("Êtes vous sûr de vouloir supprimer logiciel de votre package ?")) {
      var test = localStorage.getItem('the_soft_cart');
      let arr = JSON.parse(test);
      console.log("Panier", arr);
      for (let i=0;i<arr.length;i++){
        if(arr[i].product.id==items.product.id){
          arr.splice(i, 1);
          let json = JSON.stringify(arr);
          localStorage.setItem('the_soft_cart', json); 
          this.getCart();
          this.notice.showError("Logiciel retiré de votre package.", "Package");
        }
    }
    }

}

}
