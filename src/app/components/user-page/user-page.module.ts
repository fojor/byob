import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { UserPageComponent } from './user-page.component';
import { SharedModule } from '../../shared';


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: UserPageComponent,
            }
        ])
    ],
    declarations: [UserPageComponent],
    exports: [UserPageComponent],
})

export class UserPageModule { }