import { Component } from '@angular/core';

import { StoreService } from '../../chat/src/app/chat-container/store.service';
import { User } from '../../../app/shared';
import { take } from 'rxjs/operators';

@Component({
  selector: 'blv-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent {

    user: User;

    constructor(
        private storeService: StoreService
    ) { 
        this.storeService.getCurrentUser()
            .pipe(
                take(1),
            )
            .subscribe(user => this.user = user)
    }
}
