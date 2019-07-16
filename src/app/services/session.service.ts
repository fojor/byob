import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }


  setToken(token) {
    this.setCookie('_token', token);
  }
  getToken() {
    return this.getCookie('_token');
  }

  getLoginStatus() {
    return this.getCookie('_token') ? true : null;
  };

  setRememberMeFlag() {
    this.setCookie('remember_me_flag', true);
  };

  getRememberMeFlag() {
    return this.getCookie('remember_me_flag');
  };

  removeRememberMeFlag() {
    this.deleteCookie('remember_me_flag');
  };

  clearUserSession() {
    this.deleteCookie('_token');
    this.deleteCookie('remember_me_flag');
    localStorage.clear();
    sessionStorage.clear();
  };

  loginPage(state) {
    // $rootScope.$broadcast('logout', 'loggedOut');
    state.go('login');
    console.log("Something test");
  }

  dashboardPage(state) {
    state.go('feed');
    /* Redircetion for different users   
    switch(type)
    {
        case 'a':
        {
            if( checkLogin == 'plan_assets' )
            {
                state.go('account');
            }
            else if ( checkLogin == 'opportunity' )
            {
                state.go('opportunities');
                // $rootScope.$emit('opportunityCheck', {'status' : true});
            }
            else if ( checkLogin == 'dashboard')
            {
                state.go('company');
            }
            else
            {
                state.go('company');   
            }
        break;
        }
        case 'w':
        {
            window.location.href = 'http://demo.hashe.com/401kPredemo/401k-frontend/account';
            break;
        }           
        case 'p':
        {
            //temporarily...
            window.location.href = 'http://localhost/401kProject//401k-admin/admin/dashboard';
        }
        case 'i':
        {
            //temporarily...
            window.location.href = 'http://localhost/401kProject/401k-investment-manager/dist/dashboard';
        }
    }*/
  }

  getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1);
      if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return null;
  };

  setCookie(cname, cvalue) {
    var d = new Date();
    d.setTime(d.getTime() + (60 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
  };

  setSessionCookie(cname, cvalue) {

    var expires = "expires=0";
    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
  };

  deleteCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  };

}
