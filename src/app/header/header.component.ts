import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  product: any = [];

  constructor(
    public router: Router,
  ) { 
    router.events.subscribe((val) => {
      // see also 
      this.product = JSON.parse(localStorage.getItem('the_soft_cart')) || 0;
      console.log(val instanceof NavigationEnd) 
  });
  }

  ngOnInit(): void {
  }

}
