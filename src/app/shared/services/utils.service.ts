import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  buy : boolean = false;
  
  constructor(private toastr: ToastrService) { }

  showSuccess(title, message) {
    this.toastr.success(title, message);
  }

  showInfo(title, message){
    this.toastr.info(title, message);

  }

  showWarning(title, message){
    this.toastr.warning(title, message);
  }

  showError(title, message){
    this.toastr.error(title, message);
  }
}
