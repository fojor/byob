import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, NavigationError, NavigationExtras } from '@angular/router';
import { tap, take, shareReplay, map, distinctUntilChanged, switchMap, filter, first } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, pipe, of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { SaveDialogComponent } from './dialogs/save/save-dialog.component';
import { FileService } from './services/file.service';

@Component({
    selector: 'blv-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.css'],
})
export class BoardComponent {

    boardId: string;
    currentUserId: string;
    currentBoard: any;
    originalFile: any;
    revisionFile: any;
    data$: Observable<string>;
    isDataLoaded: boolean = true;
    fileManagerVisible: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private db: AngularFirestore,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private afAuth: AngularFireAuth,
        private fileService: FileService
    ) {
        this.afAuth.authState
            .pipe(
                take(1),
                map(i => i.uid),
                tap(i => this.currentUserId = i),
            ).subscribe();

        this.route.paramMap
            .pipe(
                take(1),
                tap((params: ParamMap) => {
                    this.boardId = params.get('id');
                    if (this.boardId) {
                        this.data$ = this.db
                            .doc('boards/' + this.boardId)
                            .valueChanges()
                            .pipe(
                                take(1),
                                tap((board: any) => {
                                    this.currentBoard = board;
                                }),
                                switchMap((board: any) => {
                                    return this.db
                                        .doc('files/' + board.ownerId)
                                        .valueChanges()
                                        .pipe(
                                            filter((result: any) => !!result),
                                            map((result: any) => {
                                                this.originalFile = result[board.fileId];
                                                if(board.revision) {
                                                    this.revisionFile = result[board.revision];
                                                }
                                                return this.originalFile;
                                            })
                                        )
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

    openFile() {
        const modalRef = this.modalService.open(SaveDialogComponent, { size: 'lg', backdrop: 'static' });

        modalRef.result.then((result) => {
            this.db.collection<any>('boards', ref => ref.where('fileId', '==', `${result.id}`).limit(1))
                .get()
                .pipe(
                    take(1),
                    tap((snapshot) => {
                        if (!snapshot.docs.length) {
                                this.db.collection<any>('boards', ref => ref.where('revision', '==', `${result.id}`).limit(1))
                                    .get()
                                    .pipe(
                                        take(1),
                                        tap((snapshot2) => {
                                            if (snapshot2.docs.length) {
                                                const board2 = snapshot2.docs[0];
                                                location.href = 'flowchart/' + board2.id;
                                            }
                                        })
                                    ).subscribe();
                        }
                        else {
                            const board = snapshot.docs[0];
                            location.href = 'flowchart/' + board.id;
                        }
                    })
                ).subscribe();

        }).catch((error) => {
            //this.showToastError(error);
        });
    }

    shareFile() {
        const modalRef = this.modalService.open(SaveDialogComponent, { size: 'lg', backdrop: 'static' });
    }

    saveData(xml: string) {

        if (this.boardId && this.currentUserId !== this.currentBoard.ownerId) {
            let result;
            if(!this.revisionFile) {
                result = this.fileService.addRevision({ 
                    isFolder: false, 
                    name: `${this.currentBoard.fileName}_revision1`, 
                    parent: this.originalFile.parent,
                    data: xml
                }, this.currentBoard.ownerId);
            }
            else {
                result = this.fileService.update(this.revisionFile.id, { data: xml })
            }

            let update = { ...this.currentBoard };
            update.revision = result.fileId;

            this.db
                .doc('boards/' + this.boardId)
                .set(update)
                .then(() => this.showToastAfterSave(result.fileName));
        }
        else {
            const modalRef = this.modalService.open(SaveDialogComponent, { size: 'lg', backdrop: 'static' });
            modalRef.componentInstance.data = xml;
            //modalRef.componentInstance.filename = this.filename;

            modalRef.result.then((result) => {
                if (!this.boardId || result.fileName !== this.originalFile.name) {
                    this.db
                        .collection('boards')
                        .add(result)
                        .then((doc) => {
                            this.router.navigate(['flowchart/' + doc.id]);
                            this.showToastAfterSave(result.fileName);
                        })
                }
                else {
                    this.db
                        .doc('boards/' + this.boardId)
                        .set(result)
                        .then(() => {
                            if(this.revisionFile) {
                                this.fileService.delete(this.revisionFile.id);
                            }
                            this.showToastAfterSave(result.fileName)
                        })
                }

            }).catch((error) => {
                //this.showToastError(error);
            });
        }
    }

    showToastAfterSave(filename: string) {
        this.toastr.success(`File <b>${filename}</b> saved successfully`);
    }

    showToastError(message) {
        if(message) {
            this.toastr.error(message);
        }
    }
}