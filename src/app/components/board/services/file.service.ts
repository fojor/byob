import { Injectable } from '@angular/core';

import { v4 } from 'uuid';
import { FileElement } from '../../../file-manager/model/element';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { tap, take, filter, combineAll, map, switchMap } from 'rxjs/operators';

export interface IFileService {
    add(fileElement: FileElement);
    delete(id: string);
    update(id: string, update: Partial<FileElement>);
    queryInFolder(folderId: string): Observable<FileElement[]>;
    get(id: string): FileElement;
}

@Injectable()
export class FileService implements IFileService {
    private map = new Map<string, FileElement>();
    private currentUserId: string;

    constructor(
        private db: AngularFirestore,
        private afAuth: AngularFireAuth,
    ) { }

    load(): Observable<any> {
        return this.afAuth.authState
            .pipe(
                map(i => i.uid),
                tap(i => this.currentUserId = i),
                take(1),
                switchMap(() => {
                    return this.db.doc('files/' + this.currentUserId).get()
                        .pipe(
                            tap((snapshot: firebase.firestore.DocumentSnapshot) => {
                                let data = snapshot.data();
                                if (data && !this.map.keys.length) {
                                    Object.keys(data).forEach(key => {
                                        this.map.set(key, data[key])
                                    })
                                }
                            })
                        )
                })
            );
    }

    add(fileElement: FileElement) {
        fileElement.id = v4();
        this.map.set(fileElement.id, this.clone(fileElement));
        this.updateDatabase(fileElement.id, fileElement, this.currentUserId);
        return {
            fileId: fileElement.id,
            ownerId: this.currentUserId,
            fileName: fileElement.name
        };
    }

    delete(id: string) {
        this.map.delete(id);
        let update = firebase.firestore.FieldValue.delete();
        this.updateDatabase(id, update, this.currentUserId);
    }

    update(id: string, update: Partial<FileElement>) {
        let element = this.map.get(id);
        element = Object.assign(element, update);
        this.map.set(element.id, element);
        this.updateDatabase(id, update, this.currentUserId);
        return {
            fileId: id,
            ownerId: this.currentUserId,
            fileName: element.name
        };
    }

    private querySubject: BehaviorSubject<FileElement[]>;
    queryInFolder(folderId: string) {
        const result: FileElement[] = [];
        this.map.forEach(element => {
            if (element.parent === folderId) {
                result.push(this.clone(element));
            }
        });
        if (!this.querySubject) {
            this.querySubject = new BehaviorSubject(result);
        } else {
            this.querySubject.next(result);
        }
        return this.querySubject.asObservable();
    }

    get(id: string) {
        return this.map.get(id);
    }

    clone(element: FileElement) {
        return JSON.parse(JSON.stringify(element));
    }

    updateDatabase(fileId: string, data: any, userId: string) {
        this.db
            .doc('files/' + userId)
            .set({
                [fileId]: data
            }, { merge: true });
    }

    addRevision(fileElement: FileElement, userId: string) {
        fileElement.id = v4();
        this.updateDatabase(fileElement.id, fileElement, userId);
        return {
            fileId: fileElement.id,
            ownerId: userId,
            fileName: fileElement.name
        };
    }
}
