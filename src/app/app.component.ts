import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {PubnubService} from './chat/src/app/chat-container/pubnub.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // loadedFeature = 'home';

  constructor(_http: HttpClient, pubnub: PubnubService) {
    pubnub.init();
    // _http.get('https://api.github.com/search.users').subscribe(results => {
    //   console.log(results);
    // });
  }


  ngOnInit() {
    // firebase.initializeApp({
    //   apiKey: "AIzaSyCtTlWispPjlBQwT7NloIPaY9f_QvoTeYo",
    //   authDomain: "byob-82a62.firebaseapp.com",
    //   databaseURL: "https://byob-82a62.firebaseio.com",
    //   projectId: "byob-82a62",
    //   storageBucket: "",
    //   messagingSenderId: "505184063712"
    // });
  }

  // onNavigate(feature: string) {
  //   this.loadedFeature = feature;
  // }
}

// BYOB.controller('HeaderController', ['$rootScope', '$scope', 'ServerRequest', 'HelperService', 'API_RESOURCES', 'Common', function ($rootScope, $scope, SR, HS, AR, C) {
//   // console.log('jiiiii');
//   $scope.userName = null;
//   $scope.profileImage = null;
//   C.getUser(function (user) {
//       if (user) {
//           $rootScope.userName = user.first_name + ' ' + user.last_name;
//           $rootScope.profileImage = user.profile_picture;
//       }
//   });
//   // $scope.logout = C.logout;
//   $scope.logout = C.logout;
// }]);
