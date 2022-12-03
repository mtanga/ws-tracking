import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { CategoryService } from '../shared/services/category.service';
import { UtilsService } from '../shared/services/utils.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  public loading = false;
  search : any ="";
  cmd : any;
  go: boolean = false;

  constructor(
    private notice : UtilsService,
    private cmdService : CategoryService,
  ) { }

  ngOnInit(): void {
  }

  searchGO(){
    if(this.search == null || this.search ==""){
      this.notice.showError("Veuillez saisir un numéro de commande correct.\nEx : FGF-20220601", "Erreur");
    }
    else{
      if(this.search.length<12){
        this.notice.showError("Votre numéro de commande ne peut pas avoir moins de 12 caractères", "Erreur")
      }
      else if(this.search.length>12){
        this.notice.showError("Votre numéro de commande ne peut pas avoir plus de 12 caractères", "Erreur")
      }
      else{
        this.loading = true;
        this.retrieveCMD(this.search);
      }
    }
  }

  isOdd(num) { 
    return num % 2;
  }


  retrieveCMD(search): void {
    this.cmdService.getAllss(search).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.cmd = data;
     // console.log("existe ?",this.cmd);
      if(this.cmd.length<1){
        this.loading = false;
        this.notice.showError("Désolé nous n'avons pas trouvé votre commande dans notre système.", "Erreur")
      }
      else{
       // this.cmd = data;
        console.log("existe ?",this.cmd);
        console.log("existe ?",this.cmd.length);
        this.loading = false;
      }
    });
  }

  addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return new Date(result).toLocaleDateString('en-US')
    return new Date(result);
  }

  removeLastCharacter(str){
    return str.substring(0, str.length - 1);
  }

  getUid(value){
    console.log(value);
    this.search = value.toUpperCase();
    if(value.length<3){
        if(this.allLetter(value)==false){
          this.search = this.removeLastCharacter(value);
          this.notice.showError("Veuillez saisir les 03 premières lettres figurant dans votre numéro de commande", "Erreur")
        }
        else{

        }
    }


    if(value.length==3){
      this.search = value+'-';
    }
    if(value.length>3){
      if(this.tesNumber(value.substring(4))==false){
        this.notice.showError("Veuille saisir la suite des chiffres figurant dans votre numéro de commande", "Erreur")
      }
    }
    if(value.length==12){
      this.notice.showSuccess("Maintenant cliquez sur valider pour lancer le tracking.", "Bravo!")
      this.go = true;
    }
  }

  allLetter(inputtxt){
   var letters = /^[A-Za-z]+$/;
   if(inputtxt.match(letters))
     {
      return true;
     }
   else
     {
     return false;
     }
  }

  tesNumber(number){
    if(!/^[0-9]+$/.test(number)){
      return false;
    }
  }

}
