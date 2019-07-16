import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const request = req.clone({ params: req.params.set('auth', this.authService.getToken()) });
    // const reqHeaders = req.clone({ headers: req.headers.set('app-language', 'it') });

    console.log('Intercepted request ', request);
    return next.handle(request)
      .pipe(
        catchError(error => {
          if (error.status === '401') { /* error of authorization */
            console.log('Redirect to login page');
            this.router.navigate(['login']);
          }
          return throwError(error);
        })

      )
  }
  constructor(private router: Router, private authService: AuthService) { }
}

// BYOB.factory('authInterceptor', function ($q, $injector, SessionService, FlashService, $rootScope) {

//   var allowedStates = ['/', 'about', 'faq', 'terms-of-use', 'contact', 'signup', 'login', 'why-401k', 'industry-news'];

//   var ResponseData = {
//       'request': function (config, data) {
//           config.headers = config.headers || {};

//           //include token only when it is api call not the angularjs templates...
//           if (config.url && config.url.indexOf('.html') == -1 && SessionService.getLoginStatus()) {
//               config.headers.Authorization = 'Bearer ' + SessionService.getToken();
//           }
//           console.log('kon?', config);
//           return config;
//       },
//       'responseError': function (res) {

//           if (res.data && res.data.type == 'auth') {
//               $rootScope.$broadcast('logout', 'loggedOut');
//               SessionService.clearUserSession();
//               FlashService.setMessage('login Failed', res.data.errorMessage);

//               var state = $injector.get('$state');
//               if (allowedStates.indexOf(state.current.name) != -1) {
//                   // console.clear();
//               } else {
//                   SessionService.loginPage(state);
//               }
//           }
//           return $q.reject(res);
//       }
//   }
//   return ResponseData;
// });