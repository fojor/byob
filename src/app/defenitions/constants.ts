import { Injectable } from '@angular/core';

const ApiEndPath = "http://apiv1.byob.world/api/";
const ApiEndPathAuth = ApiEndPath + 'auth/';
const ApiEndPathUser = ApiEndPath + 'user/';
const ApiEndPathShared = ApiEndPath + 'shared/';

@Injectable()
export class API_RESOURCES {
  readonly SIGNUP: string;
  readonly USER_LOGIN: string
  readonly SOCIAL_LOGIN: string
  readonly LOGOUT: string
  readonly VERIFY_ACCOUNT: string
  /*User Routes*/
  readonly USER_PROFILE: string

  constructor() {
    this.SIGNUP = `${ApiEndPathAuth}signup`;
    this.USER_LOGIN = ApiEndPathAuth + 'login';
    this.SOCIAL_LOGIN = ApiEndPathAuth + 'social-login';
    this.LOGOUT = ApiEndPathAuth + 'logout';
    this.VERIFY_ACCOUNT = ApiEndPathAuth + 'verify-account';
    this.USER_PROFILE = ApiEndPathUser + 'profile';
  }

  /*Shared Routes*/
  public readonly QOUTE_RANDOM = ApiEndPathShared + 'random-qoute';

  public readonly POST_REQUEST: 'post';
  public readonly GET_REQUEST: 'get';
  public readonly DELETE_REQUEST: 'delete';
  public readonly PUT_REQUEST: 'update';
  public readonly JSON_REQUEST_DATA: 'json';
  public readonly URL_ENCODED_REQUEST: 'urlencoded';
  public readonly SERVER_ERROR: ["Something went wrong on server side, please try again later!"];
}

// BYOB.constant('API_RESOURCES', (function () {

//   var ApiEndPath = "http://apiv1.byob.world/api/";

//   // if (window.location.hostname === "localhost") {
//   //     ApiEndPath = "http://localhost/byob/backend-api/public/api/";
//   // }

//   var ApiEndPathAuth = ApiEndPath + 'auth/'
//   var ApiEndPathUser = ApiEndPath + 'user/'
//   var ApiEndPathShared = ApiEndPath + 'shared/'
//   // var ApiEndPathPlus_test = ApiEndPath_Test + 'test/'

//   return {
    // POST_REQUEST: 'post',
    // GET_REQUEST: 'get',
    // DELETE_REQUEST: 'delete',
    // PUT_REQUEST: 'update',
    // JSON_REQUEST_DATA: 'json',
    // URL_ENCODED_REQUEST: 'urlencoded',
    // SERVER_ERROR: ["Something went wrong on server side, please try again later!"],

//     /*AUTH ROUTES*/
//     SIGNUP: ApiEndPathAuth + 'signup',
//     USER_LOGIN: ApiEndPathAuth + 'login',
//     SOCIAL_LOGIN: ApiEndPathAuth + 'social-login',
//     LOGOUT: ApiEndPathAuth + 'logout',
//     VERIFY_ACCOUNT: ApiEndPathAuth + 'verify-account',

//     /*User Routes*/
//     USER_PROFILE: ApiEndPathUser + 'profile',

//     /*Shared Routes*/
//     QOUTE_RANDOM: ApiEndPathShared + 'random-qoute',
//   };
// })());

