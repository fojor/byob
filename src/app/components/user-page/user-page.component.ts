import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

import { StoreService } from '../../chat/src/app/chat-container/store.service';
import { User } from '../../../app/shared';
import { take } from 'rxjs/operators';

@Component({
  selector: 'blv-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {

    user: User;

    searchForm: FormGroup;

    constructor(
        private storeService: StoreService
    ) { 
        this.storeService.getCurrentUser()
            .pipe(
                take(1),
            )
            .subscribe(user => this.user = user)
    }

  ngOnInit() {
    this.searchForm = new FormGroup({
      search: new FormControl('')
    });
  }

  searchIntrep() {
    console.log('search from user page', this.searchForm.value);
  }

}
