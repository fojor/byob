import { Component, ViewChild, ElementRef, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { tap, take, shareReplay, map, distinctUntilChanged, switchMap, filter } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { StoreService } from 'src/app/chat/src/app/chat-container/store.service';
import { Observable, pipe, of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SaveDialogComponent } from './dialogs/save/save-dialog.component';

@Component({
    selector: 'blv-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.css'],
})
export class BoardComponent {

    docId: string;
    data$: Observable<string>;
    filename: string = '';
    isDataLoaded: boolean = true;
    fileManagerVisible: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private db: AngularFirestore,
        private modalService: NgbModal
    ) {
        this.route.paramMap
            .pipe(
                take(1),
                tap((params: ParamMap) => {
                    this.docId = params.get('id');
                    if(this.docId) {
                        this.data$ = this.db
                            .doc('boards/' + this.docId)
                            .valueChanges()
                            .pipe(
                                take(1),
                                switchMap((doc: any) => {
                                    return this.db
                                        .doc('files/' + doc.ownerId)
                                        .valueChanges()
                                        .pipe(
                                            filter((result: any) => !!result.files),
                                            map((result: any) => result.files.find((i: any) => i.id === doc.fileId))
                                        )
                                }),
                                tap((file: any) => {
                                    this.filename = file.name;
                                }), 
                                distinctUntilChanged(),
                                map((file: any) => file.data),   
                                shareReplay(1),
                            )
                    }
                    else {
                        this.data$ = of("");
                    }
                })
            )
            .subscribe()      
    }

    updateData(xml: string) {
        // this.db
        //     .doc('boards/' + this.docId)            
        //     .set({ data: xml }, { merge: true })
    }

    saveData(xml: string) {
        const modalRef = this.modalService.open(SaveDialogComponent, { size: 'lg', backdrop: 'static' });
        modalRef.componentInstance.data = xml;
        //modalRef.componentInstance.filename = this.filename;
        
        modalRef.result.then((result) => {
            if(this.docId) {
                this.db
                    .doc('boards/' + this.docId)
                    .set(result)
            }
            else {
                this.db
                    .collection('boards')
                    .add(result)
                    .then((doc) => {
                        this.router.navigate(['board/' + doc.id])
                    })
            }
            
        }).catch((error) => {
            //console.log(error);
        });
    }
}