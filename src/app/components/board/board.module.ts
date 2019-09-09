import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../../shared';
import { FileManagerModule } from '../../file-manager/file-manager.module'

import { DrawIOComponent } from './drawio/drawio.component';
import { BoardComponent } from './board.component';
import { SaveDialogComponent } from './dialogs/save/save-dialog.component';
import { from } from 'rxjs';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        MatCardModule,
        NgbModule.forRoot(),
        FileManagerModule,
        RouterModule.forChild([
            { path: ':id', component: BoardComponent },
            { path: '', component: BoardComponent }
        ])
    ],
    declarations: [
        BoardComponent,
        DrawIOComponent,
        SaveDialogComponent
    ],
    exports: [
        BoardComponent
    ],
    entryComponents: [
        SaveDialogComponent
    ]
})
export class BoardModule { }
