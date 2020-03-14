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
import MergeXML from 'mergexml';

@Component({
    selector: 'blv-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.css'],
})
export class BoardComponent {

    docId: string;
    currentUserId: string;
    currentBoard: any;
    originalFile: any;
    revisionFile: any;
    data$: Observable<string>;
    isDataLoaded: boolean = true;
    fileManagerVisible: boolean = false;
    modefier = Math.random().toString(36).slice(2);

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
                    const id = params.get('id');
                    if (!id) {
                        this.db
                            .collection('boards')
                            .add({
                                data: ''
                            })
                            .then((doc) => {
                                this.router.navigate(['flowchart/' + doc.id])
                            })

                    }
                    else {
                        this.docId = params.get('id');

                        this.data$ = this.db
                            .doc('boards/' + this.docId)
                            .valueChanges()
                            .pipe(
                                //take(1),
                                filter((doc: any) => doc.modefier !== this.modefier),
                                distinctUntilChanged(),
                                tap((board: any) => {
                                    this.currentBoard = board;
                                    //console.log(board);
                                }),
                                map((doc: any) => doc.data),
                                //tap((data) => console.log(data)),
                                shareReplay(1),
                            );
                    }
                })
            )
            .subscribe()
    }

    updateData(xml: string) {
        //this.db.doc('boards/' + this.docId);
        let docRef = this.db.firestore.doc('boards/' + this.docId);

        this.db.firestore.runTransaction((transaction) => {
            // This code may get re-run multiple times if there are conflicts.
            return transaction.get(docRef).then((sfDoc) => {
                if (!sfDoc.exists) {
                    throw "Document does not exist!";
                }

                let data = xml;
                let currentData = sfDoc.data().data;
                if (currentData) {
                    data = this.mergeXML(currentData, xml);
                }

                transaction.update(docRef, { data: data, modefier: this.modefier });
            });
        }).then(() => {
            console.log("Transaction successfully committed!");
        }).catch(error => {
            docRef.set({ data: xml, modefier: this.modefier }, { merge: true })
        });



    }

    openFile() {
        const modalRef = this.modalService.open(SaveDialogComponent, { size: 'lg', backdrop: 'static' });
        modalRef.componentInstance.contacts
        modalRef.result
            .then((result: FileElement) => this.updateData(result.data))
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
                modalRef.result
                    .then(async (result: { users: User[] }) => {

                        let message = {
                            text: '',
                            timestamp: (new Date()).getTime(),
                            sender: this.currentUserId,
                        };

                        message.text += location.origin + '/flowchart/' + this.docId;

                        result.users.forEach(user => {
                            let chats = this.storeService.chats
                                .filter(i => i.participants.includes(user.id))
                                .sort(this.storeService.sortByLastUpdate)
                                .slice(0, 1);

                            if (chats.length) {
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

        const modalRef = this.modalService.open(SaveDialogComponent, { size: 'lg', backdrop: 'static' });
        modalRef.componentInstance.data = xml;
        //modalRef.componentInstance.filename = this.filename;

        modalRef.result
            .then((result) => this.showToastAfterSave(result.fileName))
            .catch((error) => {
                //this.showToastError(error);
            });
    }

    showToastAfterSave(filename: string) {
        this.toastr.success(`File <b>${filename}</b> saved successfully`);
    }

    showToastAfterShare() {
        this.toastr.success(`Files shared successfully`);
    }

    showToastError(message) {
        if (message) {
            this.toastr.error(message);
        }
    }

    private mergeXML(src1: string, src2: string) {
        var oMX = new MergeXML();
        oMX.AddSource(src1);
        oMX.AddSource(src2);
        return oMX.Get(1);
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