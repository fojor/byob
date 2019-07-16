import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
  HttpHandler,
  HttpEvent
} from "@angular/common/http";

import { Observable } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { throwError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const request = req.clone();

    return next
      .handle(request)
      .pipe(
        tap((ev: HttpEvent<any>) => {
          if (ev instanceof HttpResponse) {
            console.log('Interceptor processing response event: ', ev);
          }
        }),
        catchError(response => {
          if (response instanceof HttpErrorResponse) {
            console.log('Interceptor processing http error', response);
          }

          return throwError(response);
        })
      )
  }
}

// BYOB.factory('responseInterceptor', function ($q, $injector, $sce, $rootScope) {

//   var ResponseData = {
//       'request': function (config) {
//           config.headers = config.headers || {};
//           return config;
//       },
//       'response': function (res) {
//           // var toaster = $injector.get('toaster');
//           var HS = $injector.get('HelperService');
//           var cm = $injector.get('$compile');
//           if (res && res.data && res.data.status && res.data.status == 'success') {
//               if (res.data.successMessage) {
//                   // toaster.pop({
//                   //       type: 'success',
//                   //       body: res.data.successMessage,
//                   //       showCloseButton: true,
//                   // });
//               }
//               return $q.resolve(res);
//           }
//           if (res && res.data && res.data.status && res.data.status == 'fail') {
//               // $rootScope.errors = HS.serverSideErrors(res.data);
//               // toaster.pop({
//               //       type: 'error',
//               //       body: 'views/common/errors.html',
//               //       showCloseButton: true,
//               //       bodyOutputType: 'template'
//               // });
//               return $q.resolve(res);
//           }
//           return $q.resolve(res);
//       },
//       'responseError': function (res) {
//           return $q.reject(res);
//       }
//   }
//   return ResponseData;

// });