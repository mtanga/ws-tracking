import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';
import { ProductService } from '../shared/services/product.service';
import { UtilsService } from '../shared/services/utils.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  sub : any;
  product: any = [];
  myCart: any = [];

  constructor(
    public authService: AuthService,
    private router:Router,
    private productService : ProductService,
    private route : ActivatedRoute,
    private notice : UtilsService,
  ) { }

  ngOnInit(): void {
    this.sub = this.route
    .queryParams
    .subscribe( params  => {
      this.getProduct(params['item']);
    });
  }



  getProduct(product: any) {
    this.productService.getAllss(product).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.product = data[0];
      console.log(data[0]);
    });
  }

  addToCart(item){
    console.log("Valuer",this.checkCart(item));
    if(this.checkCart(item) == true ){
      this.notice.showWarning("Produit Déjà existant dans votre package", "Mon Package");
    }
    else{
      var test = localStorage.getItem('the_soft_cart');
      let arr = JSON.parse(test);
      let data ={
        product : item,
        qte : 1,
        id :  'cart_' + Math.random().toString(36).substr(2, 9),
        }
        if(arr==null){
                this.myCart.push(data);
                let json = JSON.stringify(this.myCart);
                localStorage.setItem('the_soft_cart', json);
                this.notice.showSuccess("Produit ajouté au package avec succès", "Mon Package");
              // this.router.navigate(['/mon-panier']);
        }
        else{
                arr.push(data);
                let json = JSON.stringify(arr);
                localStorage.setItem('the_soft_cart', json);
                this.notice.showSuccess("Produit ajouté au package avec succès", "Mon Package");
                //this.router.navigate(['/mon-panier']);
              }
      }
  }

checkCart(item){
  //var test = localStorage.getItem('the_soft_cart');
  let arr = JSON.parse(localStorage.getItem('the_soft_cart'));
  if(arr==null){
    return false;
  }
  let idx = arr.findIndex(elem => elem.product.id === item.id);
  if (idx !== -1){
    return true;
  }
  else{
    return false;
  }
 //  console.log("valeur", arr.findIndex(elem => elem.product.id === item.id));
 // return arr.findIndex(elem => elem.product.id === item.id)
}
  

}
