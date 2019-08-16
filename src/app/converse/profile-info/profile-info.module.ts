import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ProfileInfoComponent } from './profile-info.component';
import { SharedModule } from '../../shared';


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: ProfileInfoComponent,
            }
        ])
    ],
    declarations: [ProfileInfoComponent],
    exports: [ProfileInfoComponent],
})

export class ProfileInfoModule { }