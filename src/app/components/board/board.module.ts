import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule }   from '@angular/forms';

import { SharedModule } from '../../shared';
import { FileManagerModule } from '../../file-manager/file-manager.module'

import { DrawIOComponent } from './drawio/drawio.component';
import { BoardComponent } from './board.component';
import { SaveDialogComponent } from './dialogs/save/save-dialog.component';
import { FileService } from './services/file.service';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        MatCardModule,
        FormsModule,
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
    providers: [
        FileService
    ],
    entryComponents: [
        SaveDialogComponent
    ]
})
export class BoardModule { }
