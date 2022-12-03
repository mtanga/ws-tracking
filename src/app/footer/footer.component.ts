import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { map } from 'rxjs';
import { CategoryService } from '../shared/services/category.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  categories: any;
  product: any = [];

  constructor(
    public router: Router,
    private categoryService : CategoryService,
    ) {
    router.events.subscribe((val) => {
      // see also 
      this.product = JSON.parse(localStorage.getItem('the_soft_cart')) || 0;
      console.log('Route', this.get_route());
      //this.getPanier();
      console.log(val instanceof NavigationEnd) 
  });
   }

  ngOnInit(): void {
    this.product = JSON.parse(localStorage.getItem('the_soft_cart')) || 0;
    console.log("[anier ici", this.product);
    this.retrieveCategories();
  }

  get_route(){
    //console.log("Mon routeur", this.router)
    return this.router.url.split('?')[0];
  }

  retrieveCategories(){
    this.categoryService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.categories = data;
      console.log(data);
    });
  }

}
