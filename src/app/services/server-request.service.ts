import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServerRequestService {

  constructor(private http: HttpClient) { }

  makeServerRequest = function (requestType, requestDataFormat, requestUrl, requestData?) {
    switch (requestType) {
      case 'get':
        {
          return requestData == undefined ? this.http.get(requestUrl) : this.http.get(requestUrl, { params: requestData });
        }
      case 'post':
        {
          if (requestDataFormat == 'json') {
            return this.http.post(requestUrl, requestData);
          } else {
            return this.http.post(requestUrl, requestData, this.getHttpConfObj());
          }
        }
      case 'delete':
        {
          if (requestDataFormat == 'json') {
            return this.http.delete(requestUrl, { params: requestData });
          } else {
            return this.http.delete(requestUrl, { params: requestData }, this.getHttpConfObj());
          }
        }
      case 'update':
        {
          if (requestDataFormat == 'json') {
            return this.http.put(requestUrl, requestData);
          } else {
            return this.http.put(requestUrl, requestData, this.getHttpConfObj());
          }
        }
    }
  };

  getHttpConfObj() {
    return {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      transformRequest: function (obj) {
        let str = [];
        for (let p in obj)
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
      }
    };
  }

}
