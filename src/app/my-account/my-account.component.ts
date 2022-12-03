import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';
import { PayementService } from '../shared/services/payement.service';
import { UtilsService } from '../shared/services/utils.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Product } from '../shared/models/product';
import { ProductService } from '../shared/services/product.service';
import { ToastrComponentlessModule } from 'ngx-toastr';
import { ɵInternalFormsSharedModule } from '@angular/forms';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {

  title = 'Select/ Unselect All Checkboxes in Angular - FreakyJolly.com';
  masterSelected:boolean;
  checklist:any;
  checkedList:any;

  
  tab : any = "orders"
  edit : boolean = false;
  editc : boolean = false;
  edit_a : boolean = false;
  nom : any;
  prenom : any;

  step : any = {
    title : "",
    description : "",
    uid:""
  }
  order : any = {
    uid : "",
    order_number : "",
    customer_email: "",
    agent_phone: "",
    agent_name: "",
    type: "",
    method: "",
    date_order: "",
    customer_name: "",
    visible : true,
    steps : []

  }
  allSteps : any;

  user : any;
  opassword : any;
  cpassword : any;
  password : any;
  showo: boolean = false;
  show: boolean = false;
  showc: boolean = false;
  infos: any;
  phone : any;
  myData: any[];
  orders: any;
  productRef: AngularFirestoreCollection<any>;
  cmdRef : AngularFirestoreCollection<any>;
  sub: any;
  editor = ClassicEditor;
  public loading = false;
  paiements: any = [];
  data: any = "<p>Hello, world!</p>";
  private stepPath = '/steps';
  private stepPaths = '/orders';
  modifyc: boolean = false;
  modify: boolean = false;

  name_filtered_items: Array<any> | undefined;
  public goalList: any = [];
  public loadedGoalList: any[] | undefined;
  searchValue: any;
  showOn: boolean = false;
  oneStep: any;
  existTep: boolean;
  trouve: string;


  constructor(
    private payementService : PayementService,
    private authService : AuthService,
    private notice : UtilsService,
    private router: Router,
    private route : ActivatedRoute,
    private productService : ProductService,
    public noticeService : UtilsService,
    private db: AngularFirestore
    )
     {
      this.productRef = db.collection(this.stepPath);
      this.cmdRef = db.collection(this.stepPaths);
      }

  ngOnInit(): void {
    this.infos = JSON.parse(localStorage.getItem('userInfos'));
    this.user = JSON.parse(localStorage.getItem('userInfos'));
    this.getSteps();
  }

  initializeItems(): void {
    this.orders = this.loadedGoalList;
  }


  filterList() {
    this.initializeItems();
    const searchTerm = this.searchValue;
    if (!searchTerm) {
      return;
    }
    console.log(searchTerm)
    this.orders = this.goalList.filter((currentGoal: any) => {
      console.log(currentGoal);
      if (currentGoal.order_number && searchTerm) {
        if (currentGoal.order_number.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          console.log(currentGoal.order_number)
          return true;
        }
        return false;
      }
    });
  }

  removeLastCharacter(str){
    return str.substring(0, str.length - 1);
  }

  getUid(value){
    console.log(value);
    this.order.order_number = value.toUpperCase();
    if(value.length<3){
        if(this.allLetter(value)==false){
          this.order.order_number = this.removeLastCharacter(value);
          this.notice.showError("Veuillez saisir les 03 premières lettres figurant dans votre numéro de commande", "Erreur")
        }
        else{

        }
    }


    if(value.length==3){
      this.order.order_number = value+'-';
    }
    if(value.length>3){
      if(this.tesNumber(value.substring(4))==false){
        this.notice.showError("Veuille saisir la suite des chiffres figurant dans votre numéro de commande", "Erreur")
      }
    }
    if(value.length==12){
      this.notice.showSuccess("Maintenant cliquez sur valider pour lancer le tracking.", "Bravo!")
      //this.go = true;
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

  async saveCmd(){
    if(this.order.order_number == "" || this.order.order_number==null){
      this.notice.showWarning("Le numéro de commande est vide", "Oups!")
    }
    else if(this.order.customer_email == "" || this.order.customer_email==null){
      this.notice.showWarning("L'email du client est vide", "Oups!")
    }
    else if(this.order.customer_name == "" || this.order.customer_name==null){
      this.notice.showWarning("Le nom du client est vide", "Oups!")
    }
    else if(this.order.date_order == "" || this.order.date_order==null){
      this.notice.showWarning("La date de la commande est vide", "Oups!")
    }
    else if(this.order.type == "" || this.order.type==null){
      this.notice.showWarning("Le type de commande est vide", "Oups!")
    }
    else if(this.order.method == "" || this.order.method==null){
      this.notice.showWarning("La méthode d'expédition de commande est vide", "Oups!")
    }
    else if(this.order.agent_name == "" || this.order.agent_name==null){
      this.notice.showWarning("Le nom de l'agent est vide", "Oups!")
    }
    else if(this.order.agent_phone == "" || this.order.agent_phone==null){
      this.notice.showWarning("Le numéro de téléphone l'agent est vide", "Oups!")
    }
    else{
      const { id } = await this.productService.add(this.order);
      this.cmdRef.doc(id).update(
        { uid : id });
        this.notice.showSuccess("Commande ajoutée ajoutée avec succès", "Bravo!")
        this.editc=false;
    }

/*     order : any = {
      uid : "",
      order_number : "",
      customer_email: "",
      agent_phone: "",
      agent_name: "",
      type: "",
      method: "",
      date_order: "",
      customer_name: "",
      visible : true,
      steps : []
  
    } */

  }



  getSteps(){
    this.productService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.allSteps = data;
      this.getorders();
    });
  }

  getorders(){
    this.productService.getOrders().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.orders = data;
      this.goalList = data;
      this.loadedGoalList = data;
    });
  }

  delete(id){
    if (confirm("Etes-vous certain de vouloir supprimer cette étape ? ")) {
      this.productService.delete(id).then(() => {
        this.notice.showSuccess("Etape supprimée avec succès.", "Suppression");
        this.getSteps();
      })
    }

  }

  deleteo(id){
    if (confirm("Etes-vous certain de vouloir archiver cette commande ?")) {
      let data = {
        visible : false
      }
      this.productService.updates(id, data).then(() => {
        this.notice.showSuccess("Commande archivée avec succès.", "Archivage");
        this.getorders();
      })
    }

  }

  editStep(item){
    console.log(item);
    this.step = {
        title : item.title,
        description : item.description,
        uid : item.uid
    }
    this.edit=true;
    this.modify = true;
  }


  editSteps(item){
    console.log(item);
    this.order = {
      uid : item.uid,
      order_number :item.order_number,
      customer_email:item.customer_email,
      customer_name: item.customer_name,
      visible : item.visible,
      agent_phone: item.agent_phone,
      agent_name: item.agent_name,
      type: item.type,
      method: item.method,
      date_order: item.date_order
    }
    this.editc=true;
    this.modifyc = true;
  }

  editThiscmd(){
    this.cmdRef.doc(this.order.uid).update(
      { 
        order_number :this.order.order_number,
        customer_email:this.order.customer_email,
        customer_name: this.order.customer_name,
      });
      this.notice.showSuccess("Commande modifiée avec succès", "Bravo!")
      this.editc=false; 

  }


  editThisStep(){
    console.log(this.step)
    this.productRef.doc(this.step.uid).update(
      { 
        title : this.step.title,
        description : this.step.description,
      });
      this.notice.showSuccess("Etape modifiée avec succès", "Bravo!")
      this.edit=false; 

  }

  checkCheckBoxvalue(event){
    if (confirm("0000 Etes-vous certain de vouloir ajouter cette étape à cette commande ? ")) {
      
      console.log(event.target.value)
      this.allSteps.forEach(element => {
        if(element.uid == event.target.value){
          this.loading = true;
          this.trouve = "";
          console.log("ele trouve", element);
          console.log("id a chercher", event.target.value);
          if(this.checkExistStep(event.target.value)==false){
            element.date = new Date();
            this.order.steps.push(element);
            console.log("this.order.steps", this.order.steps);
            this.getSteps();
            this.cmdRef.doc(this.order.uid).update(
              {
                steps : this.order.steps
              });
              //this.resetOrder();
              this.getSteps();
              this.loading = false;
              this.notice.showSuccess("Etape définie à la commande avec succès.", "Bravo!"); 
          }
          else{
            this.loading = false;
            this.getSteps();
            //this.notice.showWarning("Cette étape a déjà été définie pour cette commande.", "Nooon!");
          }
        }
      });
    }
    else{
      this.getSteps();
    }

  }

  addCustomStep(){
    if(this.step.title != "" || this.step.description !=""){
      this.loading = true;
      this.step.date = new Date();
      this.order.steps.push(this.step);
      this.cmdRef.doc(this.order.uid).update(
        {
          steps : this.order.steps
        });
        this.loading = false;
        this.notice.showSuccess("Etape définie à la commande avec succès.", "Bravo!");
    }
  }


  resetStep(){
    this.step = {
      title : "",
      description : "",
      uid:""
    }
  }

  resetOrder(){
    this.order = {
      uid : "",
      order_number : "",
      customer_email: "",
      agent_phone: "",
      agent_name: "",
      type: "",
      method: "",
      date_order: "",
      customer_name: "",
      visible : true,
      steps : []
    }
    return true;
  }

  checkExistStep(id){
    let steps = this.order.steps;
    this.existTep = false;
    //console.log("id", id)
   // console.log("tab", steps)
  //  console.log("all step", this.order.steps);
      if(steps?.length>0){
        steps.forEach(element => {
          if(element.uid == id){
            this.existTep = true;
          }
        });
      }
      else{
        this.existTep = false;
      }

    return this.existTep;
  }




  getOneStep(id){
    this.allSteps.array.forEach(element => {
      if(element.uid = id){
        console.log("elt", element);
      }
    });
    //return this.oneStep;
  }


  showIt(item){
      this.showOn = true;
      console.log(item);
      this.order = {
        uid : item.uid,
        order_number : item.order_number,
        customer_email: item.customer_email,
        customer_name: item.customer_name,
        visible : item.visible,
        steps : item.steps
      }

  }

  disableShow(){
    this.showOn = false;
  }



  async saveStep(){
    this.step.deactivated = new Date();
    const { id } = await this.productService.create(this.step);
    this.productRef.doc(id).update(
      { uid : id });
      this.notice.showSuccess("Etape ajoutée avec succès", "Bravo!")
      this.edit=false;
 }


  getCountries(){

  }


  onCountryChange($event){
    console.log("onCountryChange", $event );
  }

  getNumber($event){
    console.log("Get number", $event );
    this.order.agent_phone = $event;

  }

  telInputObject($event){
    console.log("telInputObject", $event );
  }

  hasError($event){
    this.phone=null 
  }

getAdresse(user: any) {
  let data = {
    user : user
  }

}



passwordo() {
    this.showo = !this.showo;
}

passwordc() {
  this.showc = !this.showc;
}

passwordv() {
  this.show = !this.show;
}

logout(){
  this.authService.SignOut();
  this.router.navigate(['/connexion']);
  this.notice.showWarning("Vous n'êtes plus connecté", "Déconnexion")
}

  profile(f){
    let data ={
      last_name : f.form.value.nom,
      fisrt_name : f.form.value.prenom,
      id : this.user.id
    }

  }


  editadresse(f){
    let data = {
      pays : f.form.value.pays,
      ville : f.form.value.ville,
      phone : this.phone,
      region : f.form.value.region,
      po : f.form.value.po,
      rue : f.form.value.rue,
      user_id : this.user.id,
      id : this.infos.id
    } 


  }




  pass(){
    if (this.password == "" || this.password == undefined || this.password.length < 6) {
      this.notice.showError("Votre mot de passe est court!", "Sécurité")
    } 
    if(this.password != this.cpassword){
      this.notice.showError("Mots de passe différents", "Sécurité")
    }
    else{

    }
    let data ={
      password : this.opassword,
      current : this.password
    }
  
  }

}
