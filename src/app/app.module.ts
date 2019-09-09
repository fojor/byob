import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AppComponent } from './app.component';


import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared';

import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth-guard';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { LoginService } from './auth/login/login.service';

import { API_RESOURCES } from './defenitions/constants';
import {PubNubAngular} from 'pubnub-angular2';
import {PubnubService} from './chat/src/app/chat-container/pubnub.service';


const environment = {
  production: false,
  firebase: {
    //apiKey: 'AIzaSyB8MISXOAWoWSUOHjeBzQ1ES83_k-AZh8g',
    //projectId: 'byob-cbaea',
    apiKey: 'AIzaSyDCTuNMDmdTEOIeg__cBrwno-R_wNMKeuU',
    projectId: 'byob-chat',
    authDomain: 'byob-chat.firebaseapp.com',
    databaseURL: 'https://byob-chat.firebaseio.com/',
    storageBucket: "gs://byob-chat.appspot.com/",
  }
};

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    // ChatModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },
    AuthService,
    AuthGuard,
    LoginService,
    API_RESOURCES,
    PubNubAngular,
    PubnubService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
