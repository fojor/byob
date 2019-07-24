import { Injectable } from '@angular/core';
import {StoreService} from "./store.service";
import {User} from '../../../../shared';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private store: StoreService) {}

  public search(pattern: string): User[] {
    const lowerCasePattern = pattern.toLowerCase().trim();

    return this.store.users.filter(user => {
      return `${user.first_name} ${user.last_name}`.toLowerCase().includes(lowerCasePattern) ||
              user.email.toLowerCase().includes(lowerCasePattern)
      ;
    });
  }
}
