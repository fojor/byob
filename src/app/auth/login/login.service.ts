import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { API_RESOURCES } from 'src/app/defenitions/constants';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class LoginService {

  configUrl = this.apiConst.USER_LOGIN;

  constructor(private http: HttpClient, private apiConst: API_RESOURCES) { }

  getConfig() {
    return this.http.get(this.configUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getConfigResponse(): Observable<HttpResponse<any>> {
    return this.http.get(
      this.configUrl, { observe: 'response' });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
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