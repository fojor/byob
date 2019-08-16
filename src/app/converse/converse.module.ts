import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ConverseComponent } from './converse.component';
import { SharedModule } from '../shared';


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: ConverseComponent,
            }
        ])
    ],
    declarations: [ConverseComponent],
    exports: [ConverseComponent],
})

export class ConverseModule { }