import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';
import { CategoryService } from '../shared/services/category.service';
import { ProductService } from '../shared/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  searchValue : any;
  categories: any;
  products: any;

  name_filtered_items: Array<any> | undefined;
  public goalList: any = [];
  public loadedGoalList: any[] | undefined;
  category: any;
  categoryItem: any;
  todo: boolean = true;


  constructor(
      public authService: AuthService,
      private router:Router,
      private categoryService : CategoryService,
      private productService : ProductService,
  ) { }

  ngOnInit(): void {
    this.retrieveCategories();
  }


  initializeItems(): void {
    this.products = this.loadedGoalList;
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
      console.log(data);
      this.getProducts();
    });
  }


  getTodo(){
      this.todo = true;
      this.categoryItem = "";
      this.getProducts();
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
      this.goalList = data;
      this.loadedGoalList = data;
      console.log(data);
    });
  }



  filterList() {
    this.initializeItems();
    const searchTerm = this.searchValue;
    if (!searchTerm) {
      return;
    }
    console.log(searchTerm)
    this.products = this.goalList.filter((currentGoal: any) => {
      console.log(currentGoal);
      if (currentGoal.title && searchTerm) {
        if (currentGoal.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          console.log(currentGoal.title)
          return true;
        }
        return false;
      }
    });
  }

shorten(text: string, max: number) {
    return text && text.length > max ? text.slice(0,max).split(' ').slice(0, -1).join(' ') + '...' : text
}

format(price){
  if(price!=undefined){
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }
}

  goToCategory(item){
    console.log(item.category);
    console.log(item);
    this.categoryItem = item.id;
    this.todo = false;
    this.productService.getCategory(item.id).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.products = data;
      this.goalList = data;
      this.loadedGoalList = data;
      console.log(data);
    });

  }

  goToProduct(id){
    this.router.navigate(['/product'], { queryParams: {
      item: id,
       }
     });
  }

}
