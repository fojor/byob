import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { SessionService } from './session.service';
import { ServerRequestService } from './server-request.service';
import { API_RESOURCES } from '../defenitions/constants';

@Injectable()
export class CommonService {

  constructor(private session: SessionService, private server: ServerRequestService, private API: API_RESOURCES, private router: Router) { }

  // BYOB.service('Common', ['$rootScope', 'SessionService', 'ServerRequest', 'API_RESOURCES', '$state', function(RS, SS, SR, AR, state) {

  getUser(userId) {
    this.server.makeServerRequest(this.API.GET_REQUEST, undefined, this.API.USER_PROFILE)
      .success(function (response, status) {
        if (status == 200 && response.status == 'success') {
          console.log(response.responseData);
          // user(response.responseData);
        } else {
          console.log(status);
          // user(null);
        }
      })
      .error(function () {
        console.log(status);
        // user(null);
      })
  }

  logout() {
    this.server.makeServerRequest(this.API.DELETE_REQUEST, undefined, this.API.LOGOUT)
      .success(function (response, status) {
        //inform the application that the user has been log out...
        // RS.$broadcast('logout', 'loggedOut');
        this.session.clearUserSession();
        // CSD.clearCompanySessionData(); this function not exist at all // Lili
      })
      .error(function () {
        this.service.clearUserSession();
        //SS.loginPage(state);
        this.router.navigate(['login']);
      }).finally(function () {
        // RS.$broadcast('logout', 'loggedOut');
        this.session.clearUserSession();
        // this.session.loginPage(state); // change to navigate to login page // Lili
        this.router.navigate(['login']);
      });
  }

  // }]);

}
