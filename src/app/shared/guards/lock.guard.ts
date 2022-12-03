import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class LockGuard implements CanActivate {


  constructor(
    public router: Router
    ) 
    { }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(JSON.parse(localStorage.getItem('user_infos')).role="admin"){
        return true
      }
      return false
      
    
  }
  
}
