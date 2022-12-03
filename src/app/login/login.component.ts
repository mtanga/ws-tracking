import { IfStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { UtilsService } from '../shared/services/utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  phone_number : any;
  password : any;
  email : any;
  loginEmail : boolean = true;
  showo: boolean = false;


  constructor(
    private router: Router,
    private notice : UtilsService,
    private authService : AuthService
  ) { }

  ngOnInit(): void {

  }


  onCountryChange($event){
    console.log("onCountryChange", $event );
  }

  getNumber($event){
    console.log("Get number", $event );
    this.phone_number = $event;
   // this.check_profile_completed_update()

  }

  telInputObject($event){
    console.log("telInputObject", $event );
  }

  hasError($event){
    this.phone_number=undefined 
    //this.check_profile_completed_update()
  }

  passwordo() {
    this.showo = !this.showo;
}

  login_Email(){
    if(this.validateEmail(this.email)==!true){
      this.notice.showError("Votre e-mail n'est pas valide.", "Email")
    }
    if (this.password == "" || this.password == undefined || this.password.length < 6) {
     this.notice.showError("Votre mot de passe est court!", "Sécurité")
    } 
    else{
      let data = {
        email : this.email,
        password : this.password
      }
      //this.loginUser(data, "loginwithemail");
      this.authService.SignIn(this.email, this.password);
    }
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  loginPhone(){
    if(this.phone_number == "" || this.phone_number == undefined){
     // this.notice.showError("Votre téléphone n'est pas valide.", "Téléphone")
    }
    if (this.password == "" || this.password == undefined || this.password.length < 6) {
     // this.notice.showError("Votre mot de passe est court!", "Sécurité")
    } 
    else{
      let data = {
        phone : this.phone_number,
        password : this.password
      }
      //this.loginUser(data, "loginwithphone");
    }
  }


}
