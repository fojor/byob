import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, NavigationError, NavigationExtras } from '@angular/router';
import { tap, take, shareReplay, map, distinctUntilChanged, switchMap, filter, first } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, pipe, of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { FileService } from './services/file.service';
import { SaveDialogComponent } from './dialogs/save/save-dialog.component';
import { ShareDialogComponent } from './dialogs/share/share-dialog.component';
import { StoreService } from 'src/app/chat/src/app/chat-container/store.service';
import { FileElement } from 'src/app/file-manager';
import { User } from 'src/app/shared';
import { PubnubService } from 'src/app/chat/src/app/chat-container/pubnub.service';

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
        private fileService: FileService,
        private storeService: StoreService,
        private pubnub: PubnubService
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
        modalRef.componentInstance.contacts
        modalRef.result.then((result) => {
            this.getBoardByFileId(result.id)
                .then(boardId => location.href = 'flowchart/' + boardId);
        })
        .catch((error) => {
            //this.showToastError(error);
        });
    }

    shareFile() {

        this.storeService.init()
            .toPromise()
            .then(() => {
                const modalRef = this.modalService.open(ShareDialogComponent, { size: 'lg', backdrop: 'static' });
                modalRef.componentInstance.contacts = this.storeService.saved;
                modalRef.result.then(async (result: { files: FileElement[], users: User[]}) => {

                    let message = {
                        text: '',
                        timestamp: (new Date()).getTime(),
                        sender: this.currentUserId,
                    };
                    for(let i =0; i < result.files.length; i++) {
                        let boardId = await this.getBoardByFileId(result.files[i].id);
                        message.text += location.origin + '/flowchart/' + boardId + "\n";
                    }
                    result.users.forEach(user => {
                        let chats = this.storeService.chats
                                        .filter(i => i.participants.includes(user.id))
                                        .sort(this.storeService.sortByLastUpdate)
                                        .slice(0,1);
                        if(chats.length) {
                            this.pubnub.publish(chats[0].channel, message);
                        }
                    });
                    this.showToastAfterShare();
                })
                .catch((error) => {
                });
            });
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

    showToastAfterShare() {
        this.toastr.success(`Files shared successfully`);
    }

    showToastError(message) {
        if(message) {
            this.toastr.error(message);
        }
    }

    private getBoardByFileId(fileId): Promise<any> {
        return this.db.collection<any>('boards', ref => ref.where('fileId', '==', `${fileId}`).limit(1))
                .get()
                .toPromise()
                .then(snapshot => {
                    if (!snapshot.docs.length) {
                        return this.db.collection<any>('boards', ref => ref.where('revision', '==', `${fileId}`).limit(1))
                            .get()
                            .toPromise()
                            .then(snapshot2 => {
                                if (snapshot2.docs.length) {
                                    const board2 = snapshot2.docs[0];
                                    return board2.id;
                                }
                            })
                    }
                    else {
                        const board = snapshot.docs[0];
                        return board.id;
                    }
                })
    }
}