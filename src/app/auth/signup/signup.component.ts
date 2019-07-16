import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
// import { AngularFireAuth } from '@angular/fire/auth';
// import { auth } from 'firebase/app';
import { AuthService } from '../auth.service';

@Component({
  selector: 'blv-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SignupComponent implements OnInit {
  successMsg = '';
  serverError: string;
  signupForm: FormGroup;
  data = {
    days: this.getDays(),
    months: this.getMonths(),
    years: this.getYears()
  };

    constructor(
        private router: Router, 
        private authService: AuthService
    ) { }

  ngOnInit() {
    this.signupForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      birthday: new FormGroup({
        day: new FormControl(''),
        month: new FormControl(''),
        year: new FormControl('')
      }),
      gender: new FormControl('')
    });
  }

  registerUser() {
    this.authService.singup(this.signupForm.value)
        .then(() => this.router.navigate(['/user-page']))
        .catch(err => this.serverError = err);
    //console.log('user from signup', this.signupForm.value);
    //this.successMsg = "Sign up success";
  }

  getDays() {
    let totaldays = 31;
    let days = [];
    for (let i = 1; i <= totaldays; i++) {
      days.push(i);
    }
    return days;
  }

  getMonths() {
    let totalmonths = 12;
    let months = [];
    for (let i = 1; i <= totalmonths; i++) {
      months.push(i);
    }
    return months;
  }

  getYears() {
    let totalyears = 60;
    let years = [];
    let validYears = new Date().getFullYear() - 18;
    for (let i = validYears, n = validYears - totalyears; i > n; i--) {
      years.push(i);
    }
    return years;
  }



}

// BYOB.controller('RegisterController', ['$rootScope', '$scope', 'SessionService', 'ServerRequest', 'HelperService', 'API_RESOURCES', '$firebaseAuth', '$state', function ($rootScope, $scope, SS, SR, HS, AR, $firebaseAuth, state) {

// 	$scope.registerUser = function (data) {

// 		$scope.successMsg = null;
// 		$scope.serverErrors = null;

// 		SR.makeServerRequest(AR.POST_REQUEST, AR.URL_ENCODED_REQUEST, AR.SIGNUP, data)
// 			.success(function (ServerResponse, status) {

// 				if (status == 200 && ServerResponse.status == 'success') {
// 					$scope.successMsg = ServerResponse.successMessage;
// 				} else {
// 					$scope.serverErrors = HS.serverSideErrors(ServerResponse);
// 				}
// 			})

// 			.error(function (error, status) {

// 				if (status == 500) {
// 					$scope.serverErrors = AR.SERVER_ERROR;
// 				}
// 			});
// 	}

// 	$scope.socialLogin = function (socialType) {

// 		var auth = $firebaseAuth();

// 		// login with Facebook
// 		auth.$signInWithPopup(socialType).then(function (firebaseUser) {
// 			var profile = firebaseUser.additionalUserInfo.profile;
// 			var user = firebaseUser.user;
// 			var data = {
// 				first_name: (socialType == 'facebook') ? profile.first_name : profile.given_name,
// 				last_name: (socialType == 'facebook') ? profile.last_name : profile.family_name,
// 				email: profile.email,
// 				gender: profile.gender,
// 				phone_number: user.phoneNumber != null ? user.phoneNumber : '(NULL)',
// 				profile_picture: user.photoURL,
// 				uid: user.uid,
// 				provider_id: firebaseUser.credential.providerId
// 			};

// 			SR.makeServerRequest(AR.POST_REQUEST, AR.URL_ENCODED_REQUEST, AR.SOCIAL_LOGIN, data)
// 				.success(function (ServerResponse, status) {
// 					if (status == 200 && ServerResponse.status == 'success') {
// 						// $scope.successMsg = ServerResponse.successMessage;
// 						var token = ServerResponse.responseData.token;
// 						$scope.successMsg = ServerResponse.successMessage;
// 						SS.setToken(token);
// 						SS.dashboardPage(state);
// 					} else {
// 						$scope.serverErrors = HS.serverSideErrors(ServerResponse);
// 					}
// 				})
// 				.error(function (error, status) {
// 					if (status == 500) {
// 						$scope.serverErrors = AR.SERVER_ERROR;
// 					}
// 				});

// 			console.log("Signed in as:", data);
// 			console.log(firebaseUser);
// 			// console.log("Signed in as:", firebaseUser.user.uid);
// 		}).catch(function (error) {
// 			console.log("Authentication failed:", error);
// 		});
// 	}
// }]);