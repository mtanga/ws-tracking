import { Injectable, NgZone } from '@angular/core';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import * as firebase from 'firebase/compat/app';
import { ProfileService } from './profile.service';

import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { UtilsService } from './utils.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any; 
  itemUser : any;
  item : any;
  private dbPath = '/users';
  Ref: AngularFirestoreCollection<User>;

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
   // private afAuth : AngularFireAuth,
    public router: Router,
    private notice : UtilsService,
    private db: AngularFirestore,
    public profileService: ProfileService,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) 
  {

    this.Ref = db.collection(this.dbPath);
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        console.log("user", user);
        //localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('userInfos')!);
      } else {
        localStorage.setItem('userInfos', 'null');
        JSON.parse(localStorage.getItem('userInfos')!);
      }
    });
  }
  
  getOne(id) {
    return this.Ref.doc(id).ref.get();
  }



  getUsers(id){
    this.afs.doc(`users/${id}`)
    .snapshotChanges().pipe(
      map((doc: any) => {
        const data = doc.payload.data();
        const id = doc.payload.id;
        this.itemUser =  { id, ...data };
      })
    );
    console.log("Set user", this.itemUser);
  }



  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log("User is there", result)
        this.ngZone.run(() => {
          //this.router.navigate(['tabs/tab1']);
         // console.log("User is there 2", result.user.uid)
         if(result.user.emailVerified==false){
          //this.notice.showError("Votre e-mail n'est pas valide.", "Email")
          this.notice.showError("Désolé votre email n'est pas encore vérifiée! Veuillez consulter votre boite de reception ou vos spams.", "Mon compte");
         }
         else{
           let datas = {
            emailVerified : true
           }
          this.profileService.update(result.user.uid, datas);
          this.getUser(result.user.uid);
         }
          
        });
        //this.SetUserData(result.user);
      })
      .catch((error) => {
        this.notice.showError("Votre email ou mot de passe est incorrect", "Connexion échouée!")
        //window.alert(error.message);
       // this.presentToast("Votre email ou votre mot de passe incorrect");
      });
  }


  async getUser(id){
    await this.profileService.getOne(id).then(doc => {
     if (doc.exists) {
       console.log(doc.data());
       this.item = doc.data();
       //console.log("user ici ok", this.item);
       localStorage.setItem('userInfos', JSON.stringify(this.item));
      // this.ionLoader.hideLoader();
       if(JSON.parse(localStorage.getItem('userInfos'))){
         let userr = "Content de vous revoir "+JSON.parse(localStorage.getItem('userInfos')).first_name;
          this.notice.showSuccess(userr, "Connexion réussie!");
          this.router.navigate(['/mom-compte']);
         //console.log("Utilisateur est là :", JSON.parse(localStorage.getItem('user')))
       }
      // console.log("new", this.item)
     } else {
       console.log("There is no document!");
     }
   }).catch(function (error) {
     console.log("There was an error getting your document:", error);
   });
   }
 
 
 
 
 
 
   // Sign up with email/password
   SignUp(data) {
     return this.afAuth
       .createUserWithEmailAndPassword(data.email, data.password)
       .then((result) => {
         /* Call the SendVerificaitonMail() function when new user sign 
         up and returns promise */
         this.SendVerificationMail();
         this.SetUserDatas(result.user, data);
       })
       .catch((error) => {
         //window.alert(error.message);
        // this.presentToast(error.message);
       });
   }
 
 
 
   // Send email verfificaiton when new user sign up
   SendVerificationMail() {
     return this.afAuth.currentUser
       .then((u: any) => u.sendEmailVerification())
       .then(() => {
         this.router.navigate(['verify-email-address']);
       });
   }
   // Reset Forggot password
   ForgotPassword(passwordResetEmail: string) {
     return this.afAuth
       .sendPasswordResetEmail(passwordResetEmail)
       .then(() => {
        // this.presentToast("E-mail de réinitialisation du mot de passe envoyé, vérifiez votre boîte de réception.");
         //window.alert('Password reset email sent, check your inbox.');
       })
       .catch((error) => {
         //window.alert(error);
        // this.presentToast(error)
       });
   }
 
 

 
   // Returns true when user is looged in and email is verified
   get isLoggedIn(): boolean {
     const user = JSON.parse(localStorage.getItem('userInfos')!);
     console.log("Utilisateur connecté", user);
     return user !== null && user.emailVerified !== false ? true : false;
   }
   // Sign in with Google
   GoogleAuth() {
     return this.AuthLogin(new auth.GoogleAuthProvider()).then((res: any) => {
       if (res) {
         this.router.navigate(['tabs/tab1']);
       }
     });
   }
   // Auth logic to run auth providers
   AuthLogin(provider: any) {
     return this.afAuth
       .signInWithPopup(provider)
       .then((result) => {
         this.ngZone.run(() => {
           this.router.navigate(['tabs/tab1']);
         });
         this.SetUserData(result.user);
       })
       .catch((error) => {
         window.alert(error);
       });
   }
   /* Setting up user data when sign in with username/password, 
   sign up with username/password and sign in with social auth  
   provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
   SetUserData(user: any) {
     const userRef: AngularFirestoreDocument<any> = this.afs.doc(
       `users/${user.uid}`
     );
     const userData: User = {
       uid: user.uid,
       email: user.email,
       displayName: user.displayName,
       photoURL: '/assets/images/avatar.png',
       emailVerified: true,
       role : "client",
       phone : "",
       first_name : "",
       last_name : "",
       address : ""
     };
     return userRef.set(userData, {
       merge: true,
     });
   }

   SetUserDatas(user, data) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: data.displayName,
      photoURL: '/assets/images/avatar.png',
      emailVerified: false,
      role : "client",
      phone : data.phone,
      first_name : data.first_name,
      last_name : data.last_name,
      address : ""
    };
    return userRef.set(userData, {
      merge: true,
    });
  }
 
   
   // Sign out
   SignOut() {
     return this.afAuth.signOut().then(() => {
       localStorage.removeItem('userInfos');
       this.router.navigate(['login']);
     });
   }
 
   async updatePassword(oldCredentials, newPassword){
     const user = await this.afAuth.currentUser;
     console.log("Current User is : ");
     console.log(user);
   //  const credential = firebase.default.auth
 
 
     const credential = firebase.default.auth.EmailAuthProvider.credential(
       oldCredentials.email, 
       oldCredentials.password
   );
 
     user.reauthenticateWithCredential(credential).then(function() {
       // User re-authenticated.
       console.log("User Reauthenticated");
         user.updatePassword(newPassword).then(function() {
           // Update successful.
           console.log("Password Modified Successfully");
          // this.presentToast("Mot de passe changé avec succès!")
         }).catch(function(error) {
           // An error happened.
           console.log("Password Not Modified");
         });
     }).catch(function(error) {
       // An error happened.
       console.log("User Not Reauthenticated");
     });
 
   }


}
