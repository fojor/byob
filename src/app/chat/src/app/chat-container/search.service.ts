import { Injectable } from '@angular/core';
import {StoreService} from "./store.service";
import {User} from '../../../../shared';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private store: StoreService) {}

  public search(source: User[], pattern: string): User[] {
    const lowerCasePattern = pattern.toLowerCase().trim();
//this.store.users
    return  source.filter(user => {
      return `${user.first_name} ${user.last_name}`.toLowerCase().includes(lowerCasePattern) ||
              user.email.toLowerCase().includes(lowerCasePattern)
      ;
    });
  }
}
