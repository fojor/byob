import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { HomeComponent } from './home.component';
import { SharedModule } from '../../shared';


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: HomeComponent,
            }
        ])
    ],
    declarations: [HomeComponent],
    exports: [HomeComponent],
})

export class HomeModule { }