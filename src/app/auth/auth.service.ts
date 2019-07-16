import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { auth } from 'firebase/app';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {

  private isLoggedIn = false;

    constructor(
        private afAuth: AngularFireAuth, 
        private db: AngularFireDatabase
    ) { }

    get authenticated(): boolean {
        return this.isLoggedIn;
    }

    get currentUserObservable(): Observable<any> {
        return this.afAuth.authState;
    }

    singup(formData: any): Promise<any> {
        return this.afAuth.auth.createUserWithEmailAndPassword(formData.email, formData.password)
                .then((credential: auth.UserCredential) => {
                    this.updateUserInfo(credential.user.uid, {...formData});
                });
    }

    logIn(email: string, password: string): Promise<any> {
        return this.afAuth.auth
                .signInWithEmailAndPassword(email, password)
                .then(() => {
                    this.isLoggedIn = true;
                })
    }

    logOut() {
        return this.afAuth.auth
                .signOut()
                .then(() => {
                    this.isLoggedIn = false;
                })       
    }

    getToken() {
        return "stringAuthToken"; // implement auth token
    }

    doFacebookLogin() {
        let provider = new auth.FacebookAuthProvider();
        provider.addScope('user_birthday');
        provider.addScope('email');
        provider.addScope("user_gender");
        return this.afAuth.auth.signInWithPopup(provider)
            .then(response => {
                //console.log(response);
                let data: any = {};
                if(response.additionalUserInfo.isNewUser) {
                    let birthday = response.additionalUserInfo.profile['birthday'];  
                    if(birthday) {
                        let date = new Date(birthday);
                        data.birthday = {
                            day: date.getDate(),
                            month: date.getMonth() + 1,
                            year: date.getFullYear()
                        }
                    }
                    data.firstName = response.additionalUserInfo.profile['first_name'];
                    data.lastName = response.additionalUserInfo.profile['last_name'];
                    data.email = response.additionalUserInfo.profile['email'];
                    data.gender = response.additionalUserInfo.profile['gender'];
                    this.updateUserInfo(response.user.uid, data);
                }
            });

    }

    doGoogleLogin(): Promise<any> {
        let provider = new auth.GoogleAuthProvider();
        provider.addScope('email');
        provider.addScope('profile');
        return this.afAuth.auth.signInWithPopup(provider)
            .then(response => {
                //console.log(response);
                let data: any = {};
                if(response.additionalUserInfo.isNewUser) {
                    // let birthday = response.additionalUserInfo.profile['birthday'];  
                    // if(birthday) {
                    //     let date = new Date(birthday);
                    //     data.birthday = {
                    //         day: date.getDate(),
                    //         month: date.getMonth() + 1,
                    //         year: date.getFullYear()
                    //     }
                    // }
                    data.firstName = response.additionalUserInfo.profile['given_name'];
                    data.lastName = response.additionalUserInfo.profile['family_name'];
                    data.email = response.additionalUserInfo.profile['email'];
                    //data.gender = response.additionalUserInfo.profile['gender'];
                    this.updateUserInfo(response.user.uid, data);
                }
            });
    }

    private updateUserInfo(uid: string, data: any) {
        let update = {};
        if(data.password) {
            delete data.password;
        }
        update['/users/' + uid] = data;
        this.db.database.ref().update(update);
    }
}
