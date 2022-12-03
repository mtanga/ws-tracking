import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { UtilsService } from '../shared/services/utils.service';

@Component({
  selector: 'app-verify-email-address',
  templateUrl: './verify-email-address.component.html',
  styleUrls: ['./verify-email-address.component.css']
})
export class VerifyEmailAddressComponent implements OnInit {

  constructor(
    private router: Router,
    public authService : AuthService,
    private notice : UtilsService,
  ) { }

  ngOnInit(): void {
  }

  send(){
    this.authService.SendVerificationMail();
    this.notice.showSuccess("Nous venons de vous envoyer un nouveau mail.", "Vérification");

  }
  login(){
    this.router.navigate(['connexion'])
  }

}
