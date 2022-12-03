import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { UtilsService } from '../shared/services/utils.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit {
  email : any;

  constructor(
    public authService: AuthService,
    private notice : UtilsService,
  ) { }

  ngOnInit(): void {
  }

  reset(){
    this.authService.ForgotPassword(this.email);
    this.notice.showSuccess("Nous venons de vous envoyer un mail de réinitialisation.", "Réinitialisation")
  }

}
