import { Component, OnInit, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { reject } from 'q';
import { AuthService } from '../auth.service';
import { LoginService } from './login.service';

@Component({
  selector: 'blv-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  successMsg: string;
  serverError: string;

  loginForm: FormGroup;

    constructor(
        private router: Router, 
        private authService: AuthService, 
        private loginService: LoginService,
        private cdr: ChangeDetectorRef) { 
        this.authService.logOut();
    }

  error: any;
  headers: string[];

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.email], this.checkUser),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  loginUser() {
    if(this.loginForm.valid) {
        this.authService
            .logIn(this.username.value, this.password.value)
            .then(() => this.router.navigate(['/user-page']))
            .catch(err => this.serverError = err)
    }
  }

    onSocialLoginError(msg) {
        this.serverError = msg;
        this.cdr.detectChanges();
    }

  // custom validator of email
  checkUser(control: FormControl): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (control.value === "test@mail") {
          resolve({
            "emailNotExist": true
          });
        } else {
          resolve(null);
        }
      }, 3000);
    });
  }

  clear() {
    this.headers = undefined;
    this.error = undefined;
  }

  showConfig() {
    this.loginService.getConfig()
      .subscribe(
        (data) => console.log('hello from login component', data), // success path
        error => this.error = error // error path
      );
  }

  showConfigResponse() {
    this.loginService.getConfigResponse()
      // resp is of type `HttpResponse`
      .subscribe(resp => {
        // display its headers
        const keys = resp.headers.keys();
        this.headers = keys.map(key =>
          `${key}: ${resp.headers.get(key)}`);

        // access the body directly, which is typed as `Config`.
        // this.config = { ... resp.body };
      });
  }

}

// BYOB.controller('LoginController', ['$rootScope', '$scope', 'SessionService', 'ServerRequest', 'HelperService', 'API_RESOURCES', '$state', 'QOUTES_RANDOM', function ($rootScope, $scope, SS, SR, HS, AR, state, QR) {

//   if (QR && QR.data && QR.status == 200 && QR.data.status == 'success') {
//       $scope.qoute = QR.data.responseData;
//   }
//   $scope.loginUser = function (data) {
//       $scope.successMsg = null;
//       $scope.serverErrors = null;
//       SR.makeServerRequest(AR.POST_REQUEST, AR.URL_ENCODED_REQUEST, AR.USER_LOGIN, data)
//           .success(function (ServerResponse, status) {
//               if (status == 200 && ServerResponse.status == 'success') {
//                   console.log('login success');
//                   var token = ServerResponse.responseData.token;
//                   $scope.successMsg = ServerResponse.successMessage;
//                   SS.setToken(token);
//                   SS.dashboardPage(state);
//               }

//               else {
//                   $scope.serverErrors = HS.serverSideErrors(ServerResponse);
//                   console.log('error');
//               }
//           })
//           .error(function (error, status) {
//               if (status == 500) {
//                   $scope.serverErrors = AR.SERVER_ERROR;
//               }
//           });
//   }