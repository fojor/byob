import { Injectable } from '@angular/core';
import { Resolve} from '@angular/router';
import {Observable} from "rxjs";
import {StoreService} from "./store.service";

@Injectable({
  providedIn: 'root',
})
export class InitResolver implements Resolve<Observable<any>> {
  constructor(
    private store: StoreService,
  ) {}

  resolve(): Observable<any> {
    return this.store.init();
  }
}
